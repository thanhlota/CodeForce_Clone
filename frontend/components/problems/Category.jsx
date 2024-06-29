import React, { useState } from 'react';
import { Chip, TextField, Typography } from '@mui/material';
import { Search } from '@mui/icons-material';
import availableCategories from "@/constants/categories";

const CategoryChip = ({ category, onDelete, onClick }) => {
    return (
        <Chip
            label={category}
            onClick={onClick}
            onDelete={onDelete}
            style={{ margin: 4 }}
            sx={{ cursor: 'pointer' }}
        />
    );
};

const categories = ({ selectedCategories, handleAddCategory, handleDeleteCategory }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredCategories = availableCategories.filter(category =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Typography variant="h6" id="problem-modal-title">
                Choose Categories
            </Typography>
            <TextField
                label="Search Categories"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                    endAdornment: <Search />,
                }}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {selectedCategories.map((category, index) => (
                    <CategoryChip
                        key={index}
                        category={category}
                        onDelete={() => handleDeleteCategory(category)}
                    />
                ))}
            </div>
            <div style={{ marginTop: 16 }}>
                {filteredCategories.map((category, index) => (
                    <CategoryChip
                        key={index}
                        category={category}
                        onClick={() => handleAddCategory(category)}
                    />
                ))}
            </div>
        </>
    )
}

export default categories;