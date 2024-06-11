import React, { useState } from 'react';
import SinEscudo from './escudo.svg'
function generarFixture(equipos, idaYVuelta = true) {
    const numEquipos = equipos.length;
    const numFechas = numEquipos % 2 === 0 ? numEquipos - 1 : numEquipos;
    const numPartidosPorFecha = Math.floor(numEquipos / 2);
    const fixture = [];
    
    for (let fecha = 0; fecha < numFechas; fecha++) {
        const partidos = [];
        for (let partido = 0; partido < numPartidosPorFecha; partido++) {
            const local = (fecha + partido) % (numEquipos - 1);
            let visitante = (numEquipos - 1 - partido + fecha) % (numEquipos - 1);
            if (partido === 0) {
                visitante = numEquipos - 1;
            }
            partidos.push([equipos[local], equipos[visitante]]);
        }
        fixture.push({ fecha: fecha + 1, partidos });
    }

    if (idaYVuelta) {
        const fixtureVuelta = fixture.map((fecha) => ({
            fecha: fecha.fecha + numFechas,
            partidos: fecha.partidos.map(([local, visitante]) => [visitante, local]),
        }));
        return fixture.concat(fixtureVuelta);
    }

    return fixture;
}

function App() {
    const [equipos, setEquipos] = useState([]);
    const [nuevoEquipo, setNuevoEquipo] = useState('');
    const [nuevoEscudo, setNuevoEscudo] = useState(null);
    const [fixture, setFixture] = useState([]);
    const [resultados, setResultados] = useState({});
    const [tabla, setTabla] = useState([]);
    
    const [idaYVuelta, setIdaYVuelta] = useState(false);

    const agregarEquipo = () => {
        if (nuevoEquipo.trim() !== '') {
            const nuevoEquipoObj = {
                nombre: nuevoEquipo.trim(),
                escudo: nuevoEscudo ? nuevoEscudo : SinEscudo
            };
    
            setEquipos([...equipos, nuevoEquipoObj]);
            setNuevoEquipo('');
            setNuevoEscudo(null);
        } else {
            alert('Por favor ingrese el nombre del equipo');
        }
    };

    const generarFixtureClick = () => {
        if (equipos.length > 1) {
            const nombresEquipos = equipos.map(equipo => equipo.nombre);
            const nuevoFixture = generarFixture(nombresEquipos, idaYVuelta);
            setFixture(nuevoFixture);
        } else {
            alert('Debes ingresar al menos dos equipos.');
        }
    };

    const handleCheckboxChange = () => {
        setIdaYVuelta(!idaYVuelta);
    };
    
    const handleEscudoChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setNuevoEscudo(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleResultadoChange = (fecha, partido, equipo, valor) => {
        const key = `${fecha}-${partido}-${equipo}`;
        setResultados({ ...resultados, [key]: valor });
    };


    const calcularTabla = () => {
      const tablaTemporal = equipos.map(equipo => ({
          nombre: equipo.nombre,
          puntos: 0,
          jugados: 0,
          ganados: 0,
          empatados: 0,
          perdidos: 0,
          golesAFavor: 0,
          golesEnContra: 0,
          diferenciaGoles: 0,
      }));

      fixture.forEach(fecha => {
          fecha.partidos.forEach((partido, index) => {
              const local = partido[0];
              const visitante = partido[1];
              const localKey = `${fecha.fecha}-${index}-local`;
              const visitanteKey = `${fecha.fecha}-${index}-visitante`;
              const golesLocal = parseInt(resultados[localKey] || 0, 10);
              const golesVisitante = parseInt(resultados[visitanteKey] || 0, 10);

              const equipoLocal = tablaTemporal.find(e => e.nombre === local);
              const equipoVisitante = tablaTemporal.find(e => e.nombre === visitante);

              equipoLocal.jugados += 1;
              equipoVisitante.jugados += 1;
              equipoLocal.golesAFavor += golesLocal;
              equipoVisitante.golesAFavor += golesVisitante;
              equipoLocal.golesEnContra += golesVisitante;
              equipoVisitante.golesEnContra += golesLocal;
              equipoLocal.diferenciaGoles += golesLocal - golesVisitante;
              equipoVisitante.diferenciaGoles += golesVisitante - golesLocal;

              if (golesLocal > golesVisitante) {
                  equipoLocal.ganados += 1;
                  equipoLocal.puntos += 3;
                  equipoVisitante.perdidos += 1;
              } else if (golesVisitante > golesLocal) {
                  equipoVisitante.ganados += 1;
                  equipoVisitante.puntos += 3;
                  equipoLocal.perdidos += 1;
              } else {
                  equipoLocal.empatados += 1;
                  equipoVisitante.empatados += 1;
                  equipoLocal.puntos += 1;
                  equipoVisitante.puntos += 1;
              }
          });
      });

      tablaTemporal.sort((a, b) => b.puntos - a.puntos || b.diferenciaGoles - a.diferenciaGoles);

      setTabla(tablaTemporal);
  };

    return (
        <div className="w-[90vw] p-8 sm:max-w-[50vw] rounded-2xl bg-slate-800 m-10">
            <h1 className="mb-4 text-2xl font-bold text-white">Generador de Fixture</h1>
            <div className="flex flex-col gap-4 mb-4 sm:flex-row">
              <input
                  type="text"
                  value={nuevoEquipo}
                  onChange={(e) => setNuevoEquipo(e.target.value)}
                  placeholder="Nombre del equipo"
                  className="flex-1 p-2 border"
              />

              <div className='p-2 text-center text-white bg-blue-700 rounded cursor-pointer hover:bg-blue-500'>
                  <input
                      type="file"
                      id="escudoUpload"
                      onChange={handleEscudoChange}
                      className="hidden"
                  />
                  <label
                      htmlFor="escudoUpload"
                      className="cursor-pointer"
                  >
                      Subir Escudo
                  </label>
              </div>

              <button onClick={agregarEquipo} className="p-2 text-white bg-blue-700 rounded hover:bg-blue-500">
                  Agregar Equipo
              </button>

            </div>
            <ul className="pl-5 mb-4 list-disc">
                {equipos.map((equipo, index) => (
                    <li key={index} className="flex items-center mb-1">
                        {equipo.escudo && (
                            <img src={equipo.escudo} alt={`${equipo.nombre} escudo`} className="w-8 mr-2" />
                        )}
                        {equipo.nombre}
                    </li>
                ))}
            </ul>
            <button onClick={generarFixtureClick} className="p-2 text-white bg-green-700 rounded hover:bg-green-500">Generar Fixture</button>
            <label className="flex items-center mt-5">
                    <input
                        type="checkbox"
                        checked={idaYVuelta}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                    />
                    Ida y Vuelta
            </label>
            {fixture.length > 0 && (
                <div className="mt-8">
                {fixture.map((fecha) => (
                    <div key={fecha.fecha} className="mb-4">
                        <h2 className="text-xl font-semibold">Fecha {fecha.fecha}</h2>
                        <div className="flex flex-col gap-2 sm:flex-row">

                            <div className="mb-2 sm:mb-0">
                                <ul className="pl-5 list-disc">
                                    {fecha.partidos.map((partido, index) => (
                                        <li key={index} className="mb-1">
                                            {equipos.find((equipo) => equipo.nombre === partido[0]).escudo && (
                                                <img
                                                    src={equipos.find((equipo) => equipo.nombre === partido[0]).escudo}
                                                    alt={`${partido[0]} escudo`}
                                                    className="inline w-6 mr-2"
                                                />
                                            )}
                                            {partido[0]} <span className='font-bold text-zinc-500'>VS</span>
                                            {equipos.find((equipo) => equipo.nombre === partido[1]).escudo && (
                                                <img
                                                    src={equipos.find((equipo) => equipo.nombre === partido[1]).escudo}
                                                    alt={`${partido[1]} escudo`}
                                                    className="inline w-6 mx-2"
                                                />
                                            )}
                                            {partido[1]}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <ul className="pl-5 list-disc">
                                    {fecha.partidos.map((partido, index) => (
                                        <li key={index} className="mb-1">
                                            <input
                                                type="number"
                                                placeholder="Local"
                                                className="w-16 p-1 mx-2 border"
                                                onChange={(e) => handleResultadoChange(fecha.fecha, index, 'local', e.target.value)}
                                            />
                                            <input
                                                type="number"
                                                placeholder="Visitante"
                                                className="w-16 p-1 mx-2 border"
                                                onChange={(e) => handleResultadoChange(fecha.fecha, index, 'visitante', e.target.value)}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}

                    <button onClick={calcularTabla} className="p-2 mt-4 text-white bg-blue-700 rounded hover:bg-blue-500">Calcular Tabla General</button>
                    {tabla.length > 0 && (
                        <div className="mt-8 overflow-x-auto">
                            <h2 className="text-xl font-semibold">Tabla General</h2>
                            <table className="min-w-full rounded-lg bg-slate-700">
                                <thead>
                                    <tr>
                                        <th className="py-2">Equipo</th>
                                        <th className="py-2">Pts</th>
                                        <th className="py-2">PJ</th>
                                        <th className="py-2">G</th>
                                        <th className="py-2">E</th>
                                        <th className="py-2">P</th>
                                        <th className="py-2">GF</th>
                                        <th className="py-2">GC</th>
                                        <th className="py-2">DG</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tabla.sort((a, b) => b.puntos - a.puntos).map((equipo, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-2 border">{equipo.nombre}</td>
                                            <td className="px-4 py-2 font-bold border">{equipo.puntos}</td>
                                            <td className="px-4 py-2 border">{equipo.jugados}</td>
                                            <td className="px-4 py-2 border">{equipo.ganados}</td>
                                            <td className="px-4 py-2 border">{equipo.empatados}</td>
                                            <td className="px-4 py-2 border">{equipo.perdidos}</td>
                                            <td className="px-4 py-2 border">{equipo.golesAFavor}</td>
                                            <td className="px-4 py-2 border">{equipo.golesEnContra}</td>
                                            <td className="px-4 py-2 border">{equipo.diferenciaGoles}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
