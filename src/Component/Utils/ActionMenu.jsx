import React, { useState } from "react";

import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";

const ActionMenu = ({
  items = [],
  icon = <MoreVertIcon />,
  iconButtonProps = {},
  menuProps = {},
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick();
    }

    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick} {...iconButtonProps}>
        {icon}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        {...menuProps}
      >
        {items.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
          >
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}

            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ActionMenu;
