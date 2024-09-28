const Job = require('../models/Job');

// Créer un job
exports.createJob = async (req, res) => {
    try {
        const newJob = new Job({
            title: req.body.title,
            description: req.body.description,
            user: req.user.userId
        });
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer tous les jobs d'un utilisateur
exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ user: req.user.userId });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour un job
exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (job.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Non autorisé' });
        }

        job.title = req.body.title || job.title;
        job.description = req.body.description || job.description;
        const updatedJob = await job.save();
        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Supprimer un job
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (job.user.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Non autorisé' });
        }

        await job.remove();
        res.json({ message: 'Job supprimé' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
