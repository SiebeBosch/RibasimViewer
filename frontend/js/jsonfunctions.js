function BuildAndExecuteStochastQuery(Season, Volume, Pattern, Init, Boundary, Wind, Extra1, Extra2, Extra3, Extra4){
      //start building our json query
      let query = "";
      let querystarted = false;

      // if (Klimaat != 'all'){
      //   if (querystarted == false){
      //     query = query + "el.Klimaat === '" + Klimaat +"'";
      //     querystarted = true
      //   } else {
      //       query = query + " && el.Klimaat === '" + Klimaat + "'";
      //   };
      // }

      if (Season != 'all'){
        if (querystarted == false){
          query = query + "el.Seizoen === '" + Season +"'";
          querystarted = true
        } else {
            query = query + " && el.Seizoen === '" + Season + "'";
        };
      }

      if (Volume != 'all'){
        if (querystarted == false){
          query = query + "el.Volume === " + Volume ;
          querystarted = true
        } else {
            query = query + " && el.Volume === " + Volume ;
        };
      }

      if (Pattern != 'all'){
        if (querystarted == false){
          query = query + "el.Patroon === '" + Pattern + "'" ;
          querystarted = true
        } else {
            query = query + " && el.Patroon === '" + Pattern + "'";
        };
      }

      if (Init != 'all'){
        if (querystarted == false){
          query = query + "el.Init === '" + Init + "'" ;
          querystarted = true
        } else {
            query = query + " && el.Init === '" + Init + "'";
        };
      }

      if (Boundary != 'all'){
        if (querystarted == false){
          query = query + "el.Boundary === '" + Boundary + "'" ;
          querystarted = true
        } else {
            query = query + " && el.Boundary === '" + Boundary + "'";
        };
      }

      if (Wind != 'all'){
        if (querystarted == false){
          query = query + "el.Wind === '" + Wind + "'" ;
          querystarted = true
        } else {
            query = query + " && el.Wind === '" + Wind + "'";
        };
      }

      if (Extra1 != 'all'){
        if (querystarted == false){
          query = query + "el.Extra1 === '" + Extra1 + "'" ;
          querystarted = true
        } else {
            query = query + " && el.Extra1 === '" + Extra1 + "'";
        };
      }

      if (Extra2 != 'all'){
        if (querystarted == false){
          query = query + "el.Extra2 === '" + Extra2 + "'" ;
          querystarted = true
        } else {
            query = query + " && el.Extra2 === '" + Extra2 + "'";
        };
      }

      if (Extra3 != 'all'){
        if (querystarted == false){
          query = query + "el.Extra3 === '" + Extra3 + "'" ;
          querystarted = true
        } else {
            query = query + " && el.Extra3 === '" + Extra3 + "'";
        };
      }

      if (Extra4 != 'all'){
        if (querystarted == false){
          query = query + "el.Extra4 === '" + Extra4 + "'" ;
          querystarted = true
        } else {
            query = query + " && el.Extra4 === '" + Extra4 + "'";
        };
      }

      return query;
      
}
      
