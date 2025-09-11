import { Typography } from "@mui/material";

const HomePage = ({ theme }) => {
  return (
    <Typography variant='h4' color={theme.color.primary}>
        Bienvenido
    </Typography>
  )
}

export default HomePage;