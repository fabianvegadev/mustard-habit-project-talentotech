import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { NavBar } from '../NavBar/NavBar';
import { HabitCalendar } from '../HabitCalendar/HabitCalendar';
import { HomePage } from '../HomePage/HomePage';
import './App.css'

function useLocalStorage (itemName, initianValue) {
    
  const localStorageItem = localStorage.getItem(itemName);  
  let parsedItem;

  if (localStorageItem) {
    parsedItem = JSON.parse(localStorageItem);  
  } else {
    localStorage.setItem(itemName, JSON.stringify(initianValue));
    parsedItem = initianValue;
  }  
  
  const [item, setItem] = useState(parsedItem);    
  const saveItem = (newItem) => {
      localStorage.setItem(itemName, JSON.stringify(newItem));
      setItem(newItem);
  }
  return [item, saveItem];
}
const daysOfWeek = ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'];

function App() {
   // Función para obtener los días iniciales con sus respectivos datos
  const getDaysWithDates = (date) => {
    const daysWithDates = [];
    const today = new Date(date);
    for (let i = 0; i < 7; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() - today.getDay() + i);
      daysWithDates.push({
        name: daysOfWeek[i],
        fullDate: day.toLocaleDateString(),
        allCompleted: false
      });
    }   
    return daysWithDates;
  };  
  
  const [habits, saveHabit] = useLocalStorage('habits', []); 
  const [openModal, setOpenModal] = useState (false);  
  const [newHabitValue, setNewHabitValue] = useState('');  
  const [newHabitJornada, setNewHabitJornada] = useState('');
  const [logros, saveLogros] = useLocalStorage ('logros', []);
  const [currentDate, setCurrentDate] = useState(new Date())
  const [changeWeek, setChangeWeek] = useState(new Date()); // Estado para el movimiento de la datebar
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString());
  const inicialDaysWithDates = getDaysWithDates(currentDate);
  const [daysWithDates, setDaysWithDates] = useLocalStorage('dayWithDates', inicialDaysWithDates);  

  const selectDay = (e) => {
    setSelectedDay(e.target.title);
    console.log(e.target.title)
  };  

  // funcion para crear nuevos dias en localstorage cada vez que se le da click a las flechas de la navbar
  const createNewDates = (newDate) => {
    const newDaysWithDates = [...daysWithDates];
    const today = new Date(newDate);
    for (let i = 0; i < 7; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() - today.getDay() + i);
      const fullDay = day.toLocaleDateString()
      const existe = daysWithDates.some((day) => day.fullDate === fullDay)
      if (!existe) {
        newDaysWithDates.push(
          {
            name: daysOfWeek[i],
            fullDate: fullDay,
            allCompleted: false
          }
        )
      }     
    }   
    setDaysWithDates(newDaysWithDates)
  }

  const onAddHabit = (text, jornada) => {
    var idHabit = (Math.random() * 10);
    const newHabits = [...habits];  
    const habitText = text[0].toUpperCase() + text.substring(1);
    newHabits.unshift({
        key: idHabit,
        text: habitText,
        jornada: jornada,
        completed: false,
        date: selectedDay,
    });    
    saveHabit(newHabits);    
  }

  const onCompleteHabit = (index) => {
    const newHabits = [...habits];
    newHabits[index].completed = !newHabits[index].completed;
    newHabits.sort( (i) => i.completed ? 1 : -1);

    const newLogros = [...logros];
    const existe = logros.some((logro) => logro.date === selectedDay)
    const selectedHabits = habits.filter((habit) => habit.date === selectedDay)
    if ((selectedHabits.every((habit) => habit.completed === true)) & !existe) {
          newLogros.push({
            date: selectedDay
          })
    } else if (existe) {
      const indexABorrar = newLogros.findIndex((logro) => logro.date === selectedDay)
      newLogros.splice(indexABorrar, 1)
    }   
    saveLogros(newLogros); 
    saveHabit(newHabits);
  }

  const onDeleteHabit = (key) => {
    const newHabits = [...habits];
    newHabits.splice(newHabits.key=key, 1);
    saveHabit(newHabits);
  }

  const onEditHabit = (index, editHabitText, editHabitJornada) => {
    const editHabits = [...habits]
    editHabits[index] = {...editHabits[index], text: editHabitText, jornada: editHabitJornada}
    saveHabit(editHabits);
  }  

  // Función para retroceder una semana
  const handlePreviousWeek = () => {
    const newDate = new Date(changeWeek);
    newDate.setDate(changeWeek.getDate() - 7);
    setChangeWeek(newDate);

    createNewDates(newDate);
  };


  // Función para avanzar una semana
  const handleNextWeek = () => {
    const newDate = new Date(changeWeek);
    newDate.setDate(changeWeek.getDate() + 7);
    setChangeWeek(newDate);
    
    createNewDates(newDate);
  };

  // Repetir habitos del dia anterior inicializados en false
  // useEffect(() => {
  //   const today = new Date()
  //   today.setDate(today.getDate() - 1)
  //   const newHabits = [...habits]
  //   habits.map((habit) => {
  //     newHabits.push({
  //       key: habit.key,
  //       text: habit.text,
  //       jornada: habit.jornada,
  //       streak: 0,
  //       completed: false,
  //       date: selectedDay
  //     });
  //   })
  //   saveHabit(newHabits)
  // }, [currentDate]); 

  // Valida si las fechas de logros coinciden con las fechas del array de la navbar y cambia el valor de la propiedad allCompleted en el array
  useEffect(() => {     
    const newDaysWithDates = [...daysWithDates]  
    newDaysWithDates.forEach((day) => {
      const cierto = logros.some((logro) => logro.date === day.fullDate);
      day.allCompleted = cierto ? true : false;
    });
    setDaysWithDates(newDaysWithDates)
  }, [logros, habits])    

  return (
    <BrowserRouter>
      <div>
        <NavBar/> 
      </div> 

      <div className='NavigationContainer'>
        <Routes>
          <Route path='/mustard-habit.app/' element={
            <HomePage 
            setCurrentDate={setCurrentDate}
            logros={logros}
            saveLogros={saveLogros}
            selectDay={selectDay}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            openModal={openModal}
            setOpenModal={setOpenModal}
            newHabitValue={newHabitValue}
            setNewHabitValue={setNewHabitValue}
            newHabitJornada={newHabitJornada}
            setNewHabitJornada={setNewHabitJornada}
            habits={habits}
            onAddHabit={onAddHabit}
            onCompleteHabit={onCompleteHabit}
            onDeleteHabit={onDeleteHabit}
            onEditHabit={onEditHabit}
            currentDate={currentDate}
            changeWeek={changeWeek}
            daysWithDates={daysWithDates}
            handlePreviousWeek={handlePreviousWeek}
            handleNextWeek={handleNextWeek}
          />}/>

          <Route path='/mustard-habit.app/calendar' element={<HabitCalendar/>}/>        

        </Routes>
      </div>
        
    </BrowserRouter>
  )
}

export default App
