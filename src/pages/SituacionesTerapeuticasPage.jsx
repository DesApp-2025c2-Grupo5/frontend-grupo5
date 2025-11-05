import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, RadioGroup, FormControlLabel, Radio, Select, MenuItem, InputLabel } from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import ModalNuevaSTerapeutica from "../components/ModalNuevaSTerapeutica";
import { getSituacionTerapeuticaByMultipleParams } from "../services";
import TablaAgrupadaPorFamilia from "../components/TablaAgrupadaPorFamilia";
const getPrestadorData = () => {
  const prestador = JSON.parse(localStorage.getItem("prestador"));
  if (!prestador) return { prestador: null, medicosQueTrabajan: [], isCentroMedico: false };

  const isCentroMedico = prestador.es_centro_medico === true;
 
  const medicos = isCentroMedico
    ? prestador.medicosQueTrabajan || []
    : []; 

  return { prestador, medicosQueTrabajan: medicos, isCentroMedico };
};

const SituacionesTerapeuticasPage = ({ theme }) => {
  const { prestador: prestadorLogueado, medicosQueTrabajan, isCentroMedico } = getPrestadorData();
 const [q, setQ] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [situacionesTerapeuticas, setSituacionesTerapeuticas] = useState(null);
  const [filtro, setFiltro] = useState("todas");
  
  // Inicializamos searchMode de forma segura: ID del prestador si existe, sino cadena vacía
  const [searchMode, setSearchMode] = useState(prestadorLogueado ? prestadorLogueado._id : "");

  const prestadorLogueadoId = prestadorLogueado?._id;

  // Lógica de sincronización de searchMode (para evitar el error de estado controlado)
  useEffect(() => {
    if (prestadorLogueadoId && searchMode === "") {
        setSearchMode(prestadorLogueadoId);
    }
  }, [prestadorLogueadoId, searchMode]);


  const handleBuscar = async () => {
    // La lógica del backend debe usar 'q' y 'searchMode'
    const resultados = await getSituacionTerapeuticaByMultipleParams(q, searchMode);
    setSituacionesTerapeuticas(resultados);
  };


  const handleLimpiar = () => {
    setQ("");
    setSituacionesTerapeuticas(null);
    setFiltro("todas");
    if (prestadorLogueadoId) {
        setSearchMode(prestadorLogueadoId);
    }
  };

  const situacionesFiltradas = (situacionesTerapeuticas || []).filter((sit) => {
    if (filtro === "mias") {
      return sit.prestador?._id === prestadorLogueadoId;
    }
    return true;
  });

  
  const isPopulated = medicosQueTrabajan.length > 0 && typeof medicosQueTrabajan[0] === 'object' && medicosQueTrabajan[0]?.nombres;
  const situacionesAgrupadasPorFamilia = situacionesFiltradas.reduce((acc, sit) => {

    const socio = sit.socio;
    const titularId = socio.rol === 'Titular' 
      ? socio._id 
      : socio.es_familiar_de; 


    const key = titularId ? titularId.toString() : 'sin_titular';

    if (!acc[key]) {
      acc[key] = {
        titularId: key,
        nombreTitular: socio.rol === 'Titular' ? `${socio.apellidos}, ${socio.nombres}` : 'Familiar (Titular no encontrado)',
        situaciones: []
      };
    }


    acc[key].situaciones.push(sit);

    return acc;
  }, {});

  const gruposFamiliares = Object.values(situacionesAgrupadasPorFamilia);

  return (
    <Box>
      <Typography variant="h4" color={theme.color.primary} mb={4}>
        Situaciones Terapéuticas
      </Typography>

      <Box
        mb={2}
        display="flex"
        justifyContent={{ xs: "flex-start", md: "space-between" }}
        flexDirection={{ xs: "column-reverse", md: "row" }}
        gap={2}
      >
        <Box width="100%" display="flex" flexDirection="column" gap={3}>
          <TextField
            fullWidth
            size="small"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (q.trim()) {
                  handleBuscar();
                }
              }
            }}
            placeholder="Buscar por DNI, Nombres, Apellidos o Teléfono"
            InputProps={{
              inputProps: { "aria-label": "buscar afiliado" },
            }}
            sx={{
              maxWidth: 660,
              backgroundColor: "white",
              "& .MuiInputBase-input": {
                py: 1,
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                fontSize: '22px',
              },
            }}
          />
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "22px", width: "fit-content" }}
              onClick={handleLimpiar}
              disabled={!q.trim() && (!situacionesTerapeuticas || situacionesTerapeuticas.length === 0)}
            >
              Limpiar
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ fontSize: "22px", width: "fit-content" }}
              onClick={handleBuscar}
              disabled={!q.trim()}
            >
              Buscar
              <Search sx={{ ml: 1 }} />
            </Button>
            {/* INICIO DEL DROPDOWN DE MÉDICOS (Visible solo para Centros Médicos) */}
            {isCentroMedico && (
                <Select
                  value={searchMode} 
                  onChange={(e) => setSearchMode(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ fontSize: "16px", minWidth: 250, height: 50, color: 'primary.main', border: '1px solid', borderColor: 'primary.main' }}
                >
                    
                    <MenuItem value={prestadorLogueadoId}>
                        {prestadorLogueado?.nombres}  
                    </MenuItem>
                    
                    
                    {medicosQueTrabajan.length > 0 && !isPopulated && (
                        <MenuItem disabled>
                            (IDs sin poblar - Error de Backend)
                        </MenuItem>
                    )}
                    
                  
                    {medicosQueTrabajan.length === 0 && (
                        <MenuItem disabled>
                            (No hay médicos relacionados)
                        </MenuItem>
                    )}

                    
                    
                    {isPopulated && medicosQueTrabajan
                      .filter(medico => medico?.nombres) 
                      .map(medico => (
                        <MenuItem 
                            key={medico._id} 
                            value={medico._id}
                        >
                            {medico.nombres} {medico.apellidos}
                        </MenuItem>
                    ))}
                </Select>
            )}
            {/* FIN DEL DROPDOWN DE MÉDICOS */}
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          sx={{ fontSize: "22px", height: 'fit-content', width: { xs: '100%', md: 500 } }}
          onClick={() => setOpenModal(true)}
        >
          Agregar Situación Terapéutica
          <Add sx={{ ml: 1 }} />
        </Button>
      </Box>
      {situacionesTerapeuticas !== null && (
        <>
          <RadioGroup row value={filtro} onChange={(e) => setFiltro(e.target.value)} sx={{ mb: 2 }}>
            <FormControlLabel value="todas" control={<Radio />} label="Ver todas las situaciones terapéuticas" />
            <FormControlLabel
              value="mias"
              control={<Radio />}
              label="Ver las creadas por mi"
              disabled={!prestadorLogueadoId}
            />
          </RadioGroup>

          {/* <TableSituacionesTerapeuticas situacionesTerapeuticas={situacionesFiltradas} /> */}
          <TablaAgrupadaPorFamilia gruposFamiliares={gruposFamiliares} />
        </>
      )}

      <ModalNuevaSTerapeutica openModal={openModal} setOpenModal={setOpenModal} />
    </Box>
  );
};

export default SituacionesTerapeuticasPage;