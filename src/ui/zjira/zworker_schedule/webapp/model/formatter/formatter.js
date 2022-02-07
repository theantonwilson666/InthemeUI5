sap.ui.define([], function () {
	return {
		DateTimeCorrectTitle:function(dateTime){
			var weekDays = {
				0:'Воскресенье',
				1:'Понедельник',
				2:"Вторник",
				3:'Среда',
				4:'Четверг',
				5:'Пятница',
				6:'Суббота'
			}
			if(dateTime){
				var currentWeekDay = weekDays[dateTime.getDay()],
					currentDate = dateTime.getDate(),
					currentMonth = dateTime.getMonth()+1,
					currentYear = dateTime.getFullYear();
				return `${currentDate}.${currentMonth}.${currentYear}, ${currentWeekDay}`
			}
			
		},
		FormatRowHighlight:function(Criticality){
			  
			// if(Criticality=='Empty'){
			// 	return "Error"
			// }
			if(Criticality=='Green'){
				return "Success"
			}
			if(Criticality=='Yellow'){
				return "Warning"
			}
			
			else{
				  
			}
			  
			// return Criticality
		},
		Percent:function(percent){
			if(percent){
				return `${percent}%`
			}
		},
	
	}});
