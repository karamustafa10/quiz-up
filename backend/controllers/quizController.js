const Quiz = require('../models/Quiz');

const generateJoinCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };
  
  exports.createQuiz = async (req, res) => {
    try {
      const { title, questions } = req.body;
  
      if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Sadece öğretmenler quiz oluşturabilir.' });
      }
  
      const newQuiz = new Quiz({
        title,
        joinCode: generateJoinCode(), // burada kod üretiyoruz
        questions,
        createdBy: req.user._id
      });
  
      await newQuiz.save();
  
      res.status(201).json({ message: 'Quiz başarıyla oluşturuldu.', quiz: newQuiz });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Quiz oluşturulamadı.' });
    }
  };

  exports.joinQuiz = async (req, res) => {
    try {
      const { code } = req.params;
  
      const quiz = await Quiz.findOne({ joinCode: code });
  
      if (!quiz) {
        return res.status(404).json({ message: 'Bu koda sahip bir quiz bulunamadı.' });
      }
  
      res.status(200).json(quiz);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Quiz aranırken bir hata oluştu.' });
    }
  };
  
  
