import { Box, Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

function MenuOption({ path, label }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <Box 
      sx={{ typography: pathname === path ? 'topMenuSelected' : 'topMenu', cursor: 'pointer' }} 
      onClick={() => navigate(path)}
    >
      {label}
    </Box>
  );
}

export function TopMenu({ theme }) {
  return (
    <Stack direction='row' alignItems='center' spacing={8} sx={{ width: '100%', height: '4rem', backgroundColor: theme.color.primary, pl: 4 }}>
      <MenuOption path='/' label='Inicio' />
      <MenuOption path='/films' label='Películas' />
      <MenuOption path='/actors' label='Actores' />
    </Stack>
  );
}