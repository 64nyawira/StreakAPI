class Habit {
    habitname: string;
    datestop: Date;

    constructor(habitname: string, datestop: Date) {
        this.habitname = habitname;
        this.datestop = datestop;
    }

    getnodays(): number {
        const currentdate = new Date();
        const dayspassed = Math.floor(
            (currentdate.getTime() - this.datestop.getTime()) / (1000 * 3600 * 24)
        );
        return dayspassed;
    }
}

async function fetchHabits(): Promise<any[]> {
    try {
        const response = await fetch("http://localhost:3000/habits");
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error("Failed to fetch habits.");
        }
    } catch (error) {
        console.error("Error fetching habits:", error);
        return [];
    }
}

async function saveHabit(habit: Habit): Promise<void> {
    try {
        const response = await fetch("http://localhost:3000/habits", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                days: habit.getnodays(),
                name: habit.habitname,
                date: habit.datestop.toISOString().slice(0, 10),
            }),
        });

        if (!response.ok) {
            const errorText = await response.text(); 
            console.error("Error response from server:", response.status, errorText);
            throw new Error(`Failed to save habit. Status: ${response.status}, Details: ${errorText}`);
        }
    } catch (error) {
        console.error("Error saving habit:", error);
        throw error;
    }
}

async function displayHabits() {
    const display = document.querySelector('.display');
    if (!display) return;

    display.innerHTML = '';

    const habitsData = await fetchHabits();
    const habits: Habit[] = habitsData.map((habitData: any) => {
        return new Habit(habitData.name, new Date(habitData.date));
    });

    const habitList = document.createElement('div');
    habitList.className = 'habitList';

    habits.forEach((habit) => {
        const habitItem = document.createElement('div');
        habitItem.className = 'habitItem';

    
        const image = document.createElement('img');
        image.className = "picture"
        image.style.height='100px'
        image.setAttribute('src',`https://th.bing.com/th?q=Cycling+Cartoon+Images&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=en-WW&cc=KE&setlang=en&adlt=moderate&t=1&mw=247`)

        const habitName = document.createElement('p');
        habitName.textContent = habit.habitname;

        const totalDays = document.createElement('p');
        totalDays.textContent = `(${habit.getnodays()} days)`;

        habitItem.appendChild(image)
        habitItem.appendChild(habitName);
        habitItem.appendChild(totalDays);
        

        habitList.appendChild(habitItem);
    });

    display.appendChild(habitList);
}

let addHabitButton = document.getElementById("add_habit");
let formContainer = document.querySelector("#formContainer");

async function displayForm(): Promise<void> {
    if (!formContainer) {
        console.error("No element with id '#formContainer' found.");
        return;
    }

    formContainer.innerHTML = ''; 

    const formCont = document.createElement('div');
    formCont.className = "formCont";

    const habitForm = document.createElement('form');
    habitForm.className = "form";

    const habitNameInput = document.createElement('input');
    habitNameInput.type = "text";
    habitNameInput.id = "habitname";
    habitNameInput.name = "habitname";
    habitNameInput.placeholder = "Enter the name of the habit...";

    const habitDateInput = document.createElement('input');
    habitDateInput.type = "date";
    habitDateInput.id = "habitdate";
    habitDateInput.name = "habitdate";
    habitDateInput.placeholder = "Enter the date...";

    const submitButton = document.createElement('input');
    submitButton.type = "submit";
    submitButton.id = "submitbttn";

    habitForm.appendChild(habitNameInput);
    habitForm.appendChild(habitDateInput);
    habitForm.appendChild(submitButton);
    formCont.appendChild(habitForm);
    formContainer.appendChild(formCont);

    habitForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(habitForm);
        const name = formData.get('habitname') as string;
        const date = formData.get('habitdate') as string;

        if (name && date) {
            const habit = new Habit(name, new Date(date));
            try {
                await saveHabit(habit);
                alert('Habit saved');
                displayHabits();
            } catch (error) {
                alert('Failed to save habit.');
            }
        } else {
            alert('Please enter habit name and date.');
        }
    });
}

if (addHabitButton) {
    addHabitButton.addEventListener("click", displayForm);
} else {
    console.error("No element with id '#add_habit' found.");
}


displayHabits();
