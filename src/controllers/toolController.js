const ToolModel = require('../models/toolModel');
const fs = require('fs');

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

exports.getTools = async (req, res) => {
    try {
        let query = {};
        if (req.query.query) {
            const escapedQuery = escapeRegExp(req.query.query);
            query = { name: { $regex: new RegExp(escapedQuery, 'i') } };
        }
        if (req.query.availability && req.query.availability !== 'all') {
            query.availability = req.query.availability;
        }
        const tools = await ToolModel.find(query);
        res.json(tools);
    } catch (error) {
        console.error('Error fetching tools:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.addToolsEquipment = async (req, res) => {
    const { name, description, quantity, price } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        const existingTool = await ToolModel.findOne({ name });
        if (existingTool) {
            return res.status(400).json({ error: "This Tool/Equipment already exists!" });
        }
        
        await ToolModel.create({
            name: name,
            description: description,
            quantity: quantity,
            price: price,
            availability: 'Available',
            img: image
        });
       

        return res.status(201).json({ message: 'Tool/Equipment added successfully' });
    } catch (error) {
        console.error('Error adding tool/equipment:', error);
        res.status(500).send('Internal Server Error');
    }
};
exports.getToolDetails = async (req, res) => {
    const toolId = req.query.id;
    try {
        const tool = await ToolModel.findById(toolId);
        if (!tool) {
            return res.status(404).json({ error: 'Tool not found' });
        }
        res.json(tool);
    } catch (error) {
        console.error('Error fetching tool details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateToolQuantity = async (req, res) => {
    const { _id, quantity } = req.body;
    try {
        const tool = await ToolModel.findOneAndUpdate(
            { _id: _id },
            { $inc: { quantity } },
            { new: true }
        );

        if (!tool) {
            return res.status(404).json({ error: "Tool/Equipment not found" });
        }
        if (tool.quantity <= 0 && tool.availability !== 'unavailable') {
            tool.availability = 'unavailable';
            await tool.save();
        } else if (tool.quantity > 0 && tool.availability !== 'available') {
            tool.availability = 'available';
            await tool.save();
        }
        res.json({ message: 'Tool/Equipment quantity updated successfully', tool });
    } catch (error) {
        console.error('Error updating tool quantity:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.updateToolAvailability = async (req, res) => {
    const { tool, availability } = req.body;
    try {
        const checkToolQuantity = await ToolModel.findById(tool._id);
        if(checkToolQuantity.quantity <= 0){
            return res.status(400).json({error: `Tool cannot be updated because tool quantity is ${checkToolQuantity.quantity}`});
        }
        const toolUpdate = await ToolModel.findOneAndUpdate(
            { _id: tool._id },
            { availability: availability },
            { new: true }
        );

        if (!toolUpdate) {
            return res.status(404).json({ error: "Tool/Equipment not found" });
        }

        res.json({ message: `${tool.name} availability updated successfully`, tool });
    } catch (error) {
        console.error('Error updating tool availability:', error);
        res.status(500).send('Internal Server Error');
    }
};

//for the buttons
exports.updateToolDetails = async (req, res) => {
    const toolId = req.query.id;
    const { name, description, quantity, price } = req.body;
    const toolPic = req.file.filename;

    try {
        if(toolPic){
            const toolDeletePic = await ToolModel.findById(toolId);
            fs.unlinkSync(`assets/images/${toolDeletePic.img}`);
        }
        const tool = await ToolModel.findByIdAndUpdate(
            toolId,
            { name, description, quantity, price, img: toolPic},
            { new: true }
        );

        if (!tool) {
            return res.status(404).json({ error: 'Tool not found' });
        }
        res.json(tool);
    } catch (error) {
        console.error('Error updating tool details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteTool = async (req, res) => {
    const toolId = req.query.id;

    try {
        const tool = await ToolModel.findByIdAndDelete(toolId);

        if (!tool) {
            return res.status(404).json({ error: 'Tool not found' });
        }
        fs.unlinkSync(`assets/images/${tool.img}`);
        res.json({ message: 'Tool deleted successfully' });
    } catch (error) {
        console.error('Error deleting tool:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


