module.exports=getDate;
function getDate(){
    let today=new Date();
    let currentDay=today.getDay();
    
    
   let option={
       weekday:"long",
       day:"numeric",
       month:"long"
   };
  
   let day=today.toLocaleDateString("hi-IN",option);
   return day;
}