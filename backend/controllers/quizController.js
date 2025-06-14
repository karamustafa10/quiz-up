// Quiz işlemleri için controller
const Quiz = require('../models/Quiz');
const generateJoinCode = require('../utils/generateJoinCode'); // Katılım kodu üretici fonksiyon import edildi

// Quiz oluşturma işlemi
exports.createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;

    // Sadece öğretmenler quiz oluşturabilir
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Sadece öğretmenler quiz oluşturabilir.' });
    }

    // Yeni quiz nesnesi oluşturuluyor
    const newQuiz = new Quiz({
      title,
      joinCode: generateJoinCode(), // Katılım kodu üretiliyor
      questions,
      createdBy: req.user._id
    });

    await newQuiz.save(); // Quiz veritabanına kaydediliyor

    res.status(201).json({ message: 'Quiz başarıyla oluşturuldu.', quiz: newQuiz });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Quiz oluşturulamadı.' });
  }
};

// Quiz'e katılım işlemi
exports.joinQuiz = async (req, res) => {
  try {
    const { code } = req.params;

    // Katılım koduna göre quiz aranıyor
    const quiz = await Quiz.findOne({ joinCode: code });

    if (!quiz) {
      return res.status(404).json({ message: 'Bu koda sahip bir quiz bulunamadı.' });
    }

    res.status(200).json(quiz); // Quiz bulunduysa döndür
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Quiz aranırken bir hata oluştu.' });
  }
};
  
  
