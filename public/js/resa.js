minDate =  new Date();
disabledArr = [];
let startDate;
let endDate;
const resetDatePicker = () => $(function() {
    $('input[name="datetimes"]').daterangepicker({
        isInvalidDate: function(arg){
            // Prepare the date comparision
            var thisMonth = arg._d.getMonth()+1;   // Months are 0 based
            if (thisMonth<10){
                thisMonth = "0"+thisMonth; // Leading 0
            }
            var thisDate = arg._d.getDate();
            if (thisDate<10){
                thisDate = "0"+thisDate; // Leading 0
            }
            var thisYear = arg._d.getYear()+1900;   // Years are 1900 based
   
            var thisCompare = thisMonth +"/"+ thisDate +"/"+ thisYear;
   
            if($.inArray(thisCompare,disabledArr)!=-1){
                return true;
            }
        },
      alwaysShowCalendars: true,
      timePicker: true,
      startDate: moment().startOf('day'),
      endDate: moment().startOf('day').add(1, 'day'),
      minDate,
      locale: {
        format: 'DD/MM/YYYY',
        applyLabel: "Ok",
        cancelLabel: "Annuler",
        fromLabel: "Du",
        toLabel: "Au",
        customRangeLabel: "Custom",
        separator: ' au ',
        monthNames: [
            'Janvier',
            'Février',
            'Mars',
            'Avril',
            'Mai',
            'Juin',
            'Juillet',
            'Août',
            'Septembre',
            'Octobre',
            'Novembre',
            'Décembre'
        ],
        daysOfWeek: [
            "D",
            "L",
            "M",
            "M",
            "J",
            "V",
            "S"
        ],
        firstDay: 1
      }
    }).on("apply.daterangepicker",function(e,picker){

        // Get the selected bound dates.
        startDate = picker.startDate.format('MM/DD/YYYY')
        endDate = picker.endDate.format('MM/DD/YYYY')
    
        // Compare the dates again.
        var clearInput = false;
        for(i=0;i<disabledArr.length;i++){
            if(startDate<disabledArr[i] && endDate>disabledArr[i]){
                clearInput = true;
            }
        }
    
        // If a disabled date is in between the bounds, clear the range.
        if(clearInput){
    
            // To clear selected range (on the calendar).
            const today = new Date()
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)
            $(this).data('daterangepicker').setStartDate(today);
            $(this).data('daterangepicker').setEndDate(tomorrow);
    
            // To clear input field and keep calendar opened.
            $(this).val("").focus();
    
            // Alert user!
            alert("Your range selection includes disabled dates!");
        }else{
            $(`#reservation_debut_month option[value='${picker.startDate.format('M')}']`).prop('selected', true);
            $(`#reservation_debut_day option[value='${picker.startDate.format('D')}']`).prop('selected', true);
            $(`#reservation_debut_year option[value='${picker.startDate.format('YYYY')}']`).prop('selected', true);
            $(`#reservation_fin_month option[value='${picker.endDate.format('M')}']`).prop('selected', true);
            $(`#reservation_fin_day option[value='${picker.endDate.format('D')}']`).prop('selected', true);
            $(`#reservation_fin_year option[value='${picker.endDate.format('YYYY')}']`).prop('selected', true);
        }
    });
    
  });

const fetchInfoResaChambre = chambreTo =>  $.getJSON({
    url: "/api/dates/reservations?page=1", 
    success: function(result){
        disabledArr = [];
        $(`#reservation_chambre option[value='${chambreTo}']`).prop('selected', true);
        result.forEach(resa => {
            if(resa.chambre.id==chambreTo){
                let debut = new Date(resa.debut);
                let fin =  new Date(resa.fin);
                let duree = (fin - debut)/ 86400000;
                for(d=0;d<duree;d++) {
                    currentMonth = debut.getMonth()+1
                    if (currentMonth < 10) { currentMonth = '0' + currentMonth; }
                    disabledArr.push(currentMonth+'/'+debut.getDate()+'/'+debut.getFullYear());
                    debut.setDate(debut.getDate() + 1)
                }
            }
    });
    resetDatePicker();
  }});
  
const addEventOnChangeOnChambre = () => $(function() {
    $('#chambreSelector').on('change',(event) => {
        alert( event.target.options[event.target.selectedIndex].text);  
        fetchInfoResaChambre(event.target.value);
    });
 });

 $( document ).ready(function() {
    if(window.location.href.match('reservation/new')) {
        $(`#reservation_client option[value='${user.id}']`).prop('selected', true); 
        fetchInfoResaChambre(chambre.id);
    }
    if(window.location.href.match('hotel/')) {
        $(`#reservation_client option[value='${user.id}']`).prop('selected', true);
        addEventOnChangeOnChambre();
    }
});

