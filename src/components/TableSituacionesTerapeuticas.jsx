import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function TableSituacionesTerapeuticas({ situacionesTerapeuticas }) {
    const navigate = useNavigate();

    if (!situacionesTerapeuticas) {
        return null;
    }

    if (situacionesTerapeuticas.length === 0) {
        return <Typography>No se encontraron situaciones terapéuticas</Typography>
    }

    const handleRowClick = (id) => {
        navigate(`/situaciones-terapeuticas/${id}`);
    };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Dni</TableCell>
            <TableCell>Apellidos</TableCell>
            <TableCell>Diagnóstico</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Prestador</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {situacionesTerapeuticas.map((situacionTerapeutica) => (
            <TableRow 
                key={situacionTerapeutica._id} 
                onClick={() => handleRowClick(situacionTerapeutica._id)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
            >
                <TableCell>{situacionTerapeutica.socio.dni}</TableCell>
                <TableCell>{situacionTerapeutica.socio.apellidos}</TableCell>
                <TableCell>{situacionTerapeutica.tratamiento}</TableCell>
                <TableCell>{situacionTerapeutica.socio.telefono}</TableCell>
                <TableCell>{situacionTerapeutica.prestador.apellidos}</TableCell>
            </TableRow>
        ))}
    </TableBody>
    </Table>
    </TableContainer>
  );
}