"use strict";
/*class habit{
    habitname:string;
    datestop:Date;

    constructor(habitname:string,datestop:Date){
        this.habitname=habitname
        this.datestop=datestop
    }

    getnodays():number{
        const currentdate=new Date();
        const dayspassed= Math.floor(
            (currentdate.getTime()-this.datestop.getTime())/(1000*3600*24)
        );
        return dayspassed;
    }
}
async function dispayhabit(){
    const habitsdata=await fetchHabits();
    const habits:Habit[]=habitsdata.map((habitsdata: any)=>{
        return new Habit (habitsdata.name, new Date(habitsdata.date))
    })
    const habitList= document.createElement('div')
    habitList.className='habitList'

    habits.forEach((habit)=>{
        const habitItem=document.createElement('div')
        habitItem.className= 'habitItem'

        const habitjina= document.createElement('p')
        habitjina.textContent= habit.name

       const totaldays= document.createElement('p')
       totaldays.textContent=`(${habit.getnodays()}days)`;

       habitItem.appendChild(habitjina)
       habitItem.appendChild(totaldays)
    })
}
 
