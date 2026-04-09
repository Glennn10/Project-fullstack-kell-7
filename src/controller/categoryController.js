const CategoryModel = require('../models/categoryModel');

const categoryController = {
    getAllCategories: async (req, res) => {
        try {
            const categories = await CategoryModel.getAllCategories();
            res.status(200).json({ success: true, message: 'Data kategori berhasil diambil', data: categories });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    getCategoryById: async (req, res) => {
        try {
            const category = await CategoryModel.getCategoryById(req.params.id);
            if (!category) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
            res.status(200).json({ success: true, data: category });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    createCategory: async (req, res) => {
        try {
            const { name } = req.body;
            if (!name) return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi' });
            
            const newCategory = await CategoryModel.createCategory(name);
            res.status(201).json({ success: true, message: 'Kategori berhasil ditambahkan', data: newCategory });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    updateCategory: async (req, res) => {
        try {
            const { name } = req.body;
            const updatedCategory = await CategoryModel.updateCategory(req.params.id, name);
            if (!updatedCategory) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
            res.status(200).json({ success: true, message: 'Kategori berhasil diupdate', data: updatedCategory });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const deletedCategory = await CategoryModel.deleteCategory(req.params.id);
            if (!deletedCategory) return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
            res.status(200).json({ success: true, message: 'Kategori berhasil dihapus', data: deletedCategory });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};

module.exports = categoryController;