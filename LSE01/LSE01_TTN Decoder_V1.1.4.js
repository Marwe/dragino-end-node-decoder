function Decoder(bytes, port) {
  // Decode an uplink message from a buffer
  // (array) of bytes to an object of fields.
	var value=(bytes[0]<<8 | bytes[1]) & 0x3FFF;
	var batV=parseFloat((value/1000).toFixed(2));//Battery,units:V

	value=bytes[2]<<8 | bytes[3];
	if(bytes[2] & 0x80)
	{value |= 0xFFFF0000;}
	var temp_DS18B20=parseFloat((value/10).toFixed(2));//DS18B20,temperature
   
	value=bytes[4]<<8 | bytes[5];
	var water_SOIL=parseFloat((value/100).toFixed(2));//water_SOIL,Humidity,units:%
   
	value=bytes[6]<<8 | bytes[7];
	var temp_SOIL;
	if((value & 0x8000)>>15 === 0)
		temp_SOIL=parseFloat((value/100).toFixed(2));//temp_SOIL,temperature
	else if((value & 0x8000)>>15 === 1)
		temp_SOIL=parseFloat(((value-0xFFFF)/100).toFixed(2));
   
	value=bytes[8]<<8 | bytes[9];
	var conduct_SOIL=value;//conduct_SOIL,conductivity,units:uS/cm,max:65535	uS/cm

	var s_flag = bytes[10]>>4;
	var i_flag = bytes[10]&0x0F;
  return {
       Bat:batV +" V",
       TempC_DS18B20:temp_DS18B20,
       water_SOIL:water_SOIL,
       temp_SOIL:temp_SOIL,
       conduct_SOIL:conduct_SOIL,
	   Sensor_flag:s_flag,
	   Interrupt_flag:i_flag,
  };
}
