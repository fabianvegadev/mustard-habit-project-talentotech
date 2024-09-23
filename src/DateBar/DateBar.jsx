import { useState, useEffect } from 'react';
import './DateBar.css'; 
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const DateBar = (props) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate()); // Estado para el día seleccionado

  // Función para obtener los días con las fechas correspondientes
  const getDaysWithDates = (date) => {
    const daysWithDates = [];
    const today = new Date(date);

    for (let i = 0; i < 7; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() - today.getDay() + i);
      daysWithDates.push({
        name: daysOfWeek[i],
        dayNumber: day.getDate(),
        fullDate: day // Guardamos la fecha completa
      });
    }
    return daysWithDates;
  };

  // Función para retroceder una semana
  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  // Función para avanzar una semana
  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const daysWithDates = getDaysWithDates(currentDate);

  // Resaltar el día actual automáticamente
  useEffect(() => {
    const today = new Date();
    setSelectedDay(today.getDate()); // Actualizar el día seleccionado con el día actual
  }, [currentDate]);

  



  return (
    <div className="date-bar-container">
      <button onClick={handlePreviousWeek} className="date-bar-button">
        <FiArrowLeft/>
      </button>

      {daysWithDates.map((item, index) => (
        <div 
          key={index} 
          
          className={
            `date-bar-day 
            ${(props.habits.every((habit) => habit.completed === true) & item.dayNumber === selectedDay)
              ? 'felicitaciones'
              : item.dayNumber === selectedDay
                && 'selected'}            
          `}
        >
          <div className='text-date'>{item.name}</div>
          <div className='text-date'>{item.dayNumber}</div>
        </div>
      ))}

      <button onClick={handleNextWeek} className="date-bar-button">
        <FiArrowRight/>
      </button>
    </div>
  );
};

export {DateBar};
