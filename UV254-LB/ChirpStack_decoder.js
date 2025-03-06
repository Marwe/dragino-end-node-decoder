function decodeUplink(input) {
        return {
    data: { 
            data: Decode(input.fPort, input.bytes, input.variables)
        },
    warnings: [],
    errors: []
  };   
}
function datalog(i,bytes){

  var aa= parseFloat((bytes[2+i]<<8 | bytes[2+i+1])/1000).toFixed(3); 
  var string='['+ aa +']'+',';  

  return string;
}
function Decode(fPort, bytes, variables) {
  if(fPort==5)
  {
  	var freq_band;
  	var sub_band;
    var sensor;
    
    if(bytes[0]==0x16)
      sensor= "PS--LB";
      
	  var firm_ver= (bytes[1]&0x0f)+'.'+(bytes[2]>>4&0x0f)+'.'+(bytes[2]&0x0f);
	  
    if(bytes[3]==0x01)
        freq_band="EU868";
  	else if(bytes[3]==0x02)
        freq_band="US915";
  	else if(bytes[3]==0x03)
        freq_band="IN865";
  	else if(bytes[3]==0x04)
        freq_band="AU915";
  	else if(bytes[3]==0x05)
        freq_band="KZ865";
  	else if(bytes[3]==0x06)
        freq_band="RU864";
  	else if(bytes[3]==0x07)
        freq_band="AS923";
  	else if(bytes[3]==0x08)
        freq_band="AS923_1";
  	else if(bytes[3]==0x09)
        freq_band="AS923_2";
  	else if(bytes[3]==0x0A)
        freq_band="AS923_3";
  	else if(bytes[3]==0x0F)
        freq_band="AS923_4";
  	else if(bytes[3]==0x0B)
        freq_band="CN470";
  	else if(bytes[3]==0x0C)
        freq_band="EU433";
  	else if(bytes[3]==0x0D)
        freq_band="KR920";
  	else if(bytes[3]==0x0E)
        freq_band="MA869";
  	
    if(bytes[4]==0xff)
      sub_band="NULL";
	  else
      sub_band=bytes[4];

    var bat= (bytes[5]<<8 | bytes[6])/1000;
    
  	return {
  	  SENSOR_MODEL:sensor,
      FIRMWARE_VERSION:firm_ver,
      FREQUENCY_BAND:freq_band,
      SUB_BAND:sub_band,
      BAT:bat,
  	}
  }
  else if(fPort==7)
  {
    var Bat= (bytes[0]<<8 | bytes[1])/1000;
    for(var i=0;i<bytes.length-2;i=i+2)
    {
      var data= datalog(i,bytes);
      if(i=='0')
        data_sum=data;
      else
        data_sum+=data;
    }
    return{
    Bat_V:Bat,
    DATALOG:data_sum
    };    
  }
  else
  {
    var decode={};
    decode.Bat_V= (bytes[0]<<8 | bytes[1])/1000;
    decode.Probe_mod= bytes[2];   
    decode.IDC_intput_mA= (bytes[4]<<8 | bytes[5])/1000;  
    decode.VDC_intput_V= (bytes[6]<<8 | bytes[7])/1000; 
    decode.IN1_pin_level= (bytes[8] & 0x08)? "High":"Low";   
    decode.IN2_pin_level= (bytes[8] & 0x04)? "High":"Low";   
    decode.Exti_pin_level= (bytes[8] & 0x02)? "High":"Low";  
    decode.Exti_status= (bytes[8] & 0x01)? "True":"False";
    decode.Absorbance= (bytes[6]<<8 | bytes[7])/1000+'mw/cm ²'; 
    var Absorbance= (bytes[6]<<8 | bytes[7])/1000;
    if (Absorbance>5)
    {
      
      decode.Absorbance= "invalid data"
    };
    if(bytes.length!=1)
    {
      return decode;
    }
  }
}
