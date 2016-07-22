exports.post_data = function(data){
  
  if ( data.RawCode = [6,6,1,2,5,3,2,0] ) {
  	data = {
  		User: data.User + "(after api data)",
  		RawCode: data.RawCode + "(after api data)",
  		MotionCode: "[0]"
	}
  }
  return data
}