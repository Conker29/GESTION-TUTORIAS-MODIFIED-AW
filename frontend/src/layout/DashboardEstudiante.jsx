import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parseISO } from 'date-fns';

const localizer = momentLocalizer(new Date());

const DashboardEstudiante = () => {
  const [docentes, setDocentes] = useState([]);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [eventos, setEventos] = useState([]);

  // Traer lista de docentes desde el backend
  useEffect(() => {
    fetch('/api/docentes') // Cambia URL al endpoint real que te da docentes
      .then(res => res.json())
      .then(data => setDocentes(data));
  }, []);

  // Cuando cambia el docente, cargar su disponibilidad
  useEffect(() => {
    if (!docenteSeleccionado) return;

    fetch(`/api/disponibilidad/${docenteSeleccionado}`)
      .then(res => res.json())
      .then(data => {
        setDisponibilidad(data.disponibilidad);
        //Mapear disponibilidad a eventos para el calendario
        const eventosDisponibles = [];

        data.disponibilidad.forEach(dia => {
          const diaIndex = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'].indexOf(dia.diaSemana.toLowerCase());
          if(diaIndex === -1) return;

          // Calcular fechas próximas para ese día de la semana en las próximas 2 semanas
          for(let semana=0; semana<2; semana++) {
            const hoy = new Date();
            const fechaProxima = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + ((7 + diaIndex - hoy.getDay()) % 7) + semana*7);
            
            dia.bloques.forEach(bloque => {
              const [hIni, mIni] = bloque.horaInicio.split(':');
              const [hFin, mFin] = bloque.horaFin.split(':');

              const start = new Date(fechaProxima);
              start.setHours(parseInt(hIni), parseInt(mIni));

              const end = new Date(fechaProxima);
              end.setHours(parseInt(hFin), parseInt(mFin));

              eventosDisponibles.push({
                title: 'Disponible',
                start,
                end,
                allDay: false,
                resource: { diaSemana: dia.diaSemana, bloque }
              });
            });
          }
        });
        setEventos(eventosDisponibles);
      });
  }, [docenteSeleccionado]);

  // Manejar selección de evento para agendar tutoría
  const handleSelectSlot = ({ start, end }) => {
    const fecha = start.toISOString().split('T')[0];
    const horaInicio = `${start.getHours().toString().padStart(2,'0')}:${start.getMinutes().toString().padStart(2,'0')}`;
    const horaFin = `${end.getHours().toString().padStart(2,'0')}:${end.getMinutes().toString().padStart(2,'0')}`;

    // Aquí puedes mostrar un modal o confirmación para agendar
    if(window.confirm(`¿Quieres agendar tutoría el ${fecha} desde ${horaInicio} hasta ${horaFin}?`)) {
      // Llamar API para registrar tutoría
      fetch('/tutorias/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docente: docenteSeleccionado,
          fecha,
          horaInicio,
          horaFin
        })
      }).then(res => {
        if(res.ok) alert('Tutoría agendada correctamente');
        else alert('Error al agendar');
      });
    }
  };

  return (
    <div>
      <h2>Agendar tutoría</h2>
      <select onChange={e => setDocenteSeleccionado(e.target.value)} value={docenteSeleccionado || ''}>
        <option value="">Seleccione un docente</option>
        {docentes.map(doc => (
          <option key={doc._id} value={doc._id}>{doc.nombre}</option>
        ))}
      </select>

      {docenteSeleccionado && (
        <div style={{ height: '600px', marginTop: '20px' }}>
          <Calendar
            localizer={localizer}
            events={eventos}
            defaultView="week"
            views={['week']}
            step={30}
            timeslots={1}
            selectable
            onSelectSlot={handleSelectSlot}
            style={{ height: 600 }}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardEstudiante;
