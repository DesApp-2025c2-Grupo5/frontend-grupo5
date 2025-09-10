import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";

const NotFoundPage = () => {
  return (
    <Box sx={{ typography: 'h5', color: grey[900] }}>
      Ups! Página no encontrada
    </Box>
  )
}

export default NotFoundPage;