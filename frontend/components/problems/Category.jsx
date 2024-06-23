import React, { useState } from 'react';
import { Chip } from '@mui/material';

const CategoryChip = ({ category, onDelete }) => {
    return (
        <Chip
            label={category}
            onDelete={onDelete}
            style={{ margin: 4 }}
        />
    );
};

const availableCategories = [
    'Algorithm',
    'Data Structures',
    'Dynamic Programming',
    'Graph Theory',
    'String Manipulation',
    'Sorting',
    'Recursion',
    'Greedy Algorithms',
];

const categories = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCategories = availableCategories.filter(category =>
        category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return (
        <>
            <Typography variant="h6" id="problem-modal-title" sx={{ mb: 2 }}>
                Choose Categories
            </Typography>
        </>
    )
}

export default categories;