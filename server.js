Meteor.methods ({'callWordpress' : 
  // takes site WITH slash and directive .. just appends the two together
  function(site,directive){
      if(typeof site != "undefined" && typeof site == "string" && site != '' && typeof directive != "undefined" && typeof directive == "string" && directive != '')
        var q = HTTP.get(site + directive,{headers: {"Accept":"application/json"} });
        if(q.statusCode==200){
          var respJson = JSON.parse(q.content);
          return respJson;
        }else{
          return {error: q.statusCode};
        }
      return false;
  }
});

Meteor.publish("wordpress",function(site,directive){
  if(typeof site != "undefined" && typeof site == "string" && site != ''){
    if(typeof directive == "undefined" || typeof directive != "string" || directive == ''){
      directive = "json=get_recent_posts";
    }
    var q = HTTP.get(site + '?' + directive,{headers: {"Accept":"application/json"} });
    if(q.statusCode==200){
      var respJson = JSON.parse(q.content);
      if(respJson && typeof respJson.posts != "undefined")
      {
        respJson.posts.filter(function(arr){
        // avoid entering same id?
		arr._id = arr.id + '';
 		if(wordpress.findOne({_id : arr.id + ""})){
			wordpress.upsert(arr._id,arr)
		}else{
			wordpress.insert(arr);
		}
      });
      return wordpress.find();
      }else{
        this.ready();
      } 
    }else{
      this.ready();
      return {error: q.statusCode};
    }
  }
  this.ready();
});

Meteor.publish("wpPost",function(id){
        return wordpress.find({_id : id + ""});
});
