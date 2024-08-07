import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Drawer } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useRouter } from 'next/router';
import styles from "./LeftSideBar.module.css";

const Sidebar = () => {
    const router = useRouter();
    const currentPath = router.pathname;

    const handleNavigation = (path) => {
        router.push(path);
    };

    return (
        <Drawer
            variant="permanent"
            className={styles.drawer}
        >
            <div className={styles.item_container}>
                <List>
                    <ListItem
                        button
                        onClick={() => handleNavigation('/admin')}
                        className={!currentPath.includes('/users') ? styles.active : ''}
                    >
                        <ListItemIcon>
                            <AssignmentIcon />
                        </ListItemIcon>
                        <ListItemText primary="Manage Contest" />
                    </ListItem>
                    <ListItem
                        button
                        onClick={() => handleNavigation('/admin/users')}
                        className={currentPath.includes('/admin/users') ? styles.active : ''}
                    >
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Manage User" />
                    </ListItem>
                </List>
            </div>
        </Drawer>
    );
};

export default Sidebar;
