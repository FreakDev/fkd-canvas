Fkd.createNamespace('freakdev.canvas.image');

freakdev.canvas.image.Pixel = function (comp1, comp2, comp3, comp4, mode)
{
	
	this.red = 0;
	this.green = 0;
	this.blue = 0;
	this.hue = 0;
	this.saturation = 0;
	this.luminosity = 0;
	
	this.alpha = 0;
	
	if (undefined == mode || 'rgb' == mode) {
		this.red   = comp1;
		this.green = comp2;
		this.blue  = comp3;
	} else if ('hsl' == mode) {
		this.hue  	   = comp1;
		this.saturation = comp2;
		this.luminosity  = comp3;
	}
	
	this.alpha = comp4;
};

freakdev.canvas.image.Pixel.prototype.toRGB = function ()
{

	var Hue_2_RGB = function ( v1, v2, vH )             //Function Hue_2_RGB
	{
		   if ( vH < 0 ) vH += 1;
		   if ( vH > 1 ) vH -= 1;
		   if ( ( 6 * vH ) < 1 ) return ( v1 + ( v2 - v1 ) * 6 * vH );
		   if ( ( 2 * vH ) < 1 ) return ( v2 );
		   if ( ( 3 * vH ) < 2 ) return ( v1 + ( v2 - v1 ) * ( ( 2 / 3 ) - vH ) * 6 );
		   return ( v1 );
	};
	
	if ( this.saturation == 0 )                       //HSL from 0 to 1
	{
	   R = this.luminosity * 255;                      //RGB results from 0 to 255
	   G = this.luminosity * 255;
	   B = this.luminosity * 255;
	}
	else
	{
	   if ( this.luminosity < 0.5 ) 
		   var_2 = this.luminosity * ( 1 + this.saturation );
	   else
		   var_2 = ( this.luminosity + this.saturation ) - ( this.saturation * this.luminosity );

	   var_1 = 2 * this.luminosity - var_2;

	   R = 255 * Hue_2_RGB( var_1, var_2, this.hue + ( 1 / 3 ) ); 
	   G = 255 * Hue_2_RGB( var_1, var_2, this.hue );
	   B = 255 * Hue_2_RGB( var_1, var_2, this.hue - ( 1 / 3 ) );
	}	
	
    this.red = R;
    this.green = G;
    this.blue = B;
    return {
    	'red'   : R,
    	'green' : G,
    	'blue'  : B
    };	
};

freakdev.canvas.image.Pixel.prototype.toHSL = function ()
{
	var_R = ( this.red / 255 );                     //RGB from 0 to 255
	var_G = ( this.green / 255 );
	var_B = ( this.blue / 255 );

	var_Min = Math.min( var_R, var_G, var_B );    //Min. value of RGB
	var_Max = Math.max( var_R, var_G, var_B );    //Max. value of RGB
	del_Max = var_Max - var_Min;             //Delta RGB value

	L = ( var_Max + var_Min ) / 2

	if ( del_Max == 0 )                     //This is a gray, no chroma...
	{
	   H = 0;                                //HSL results from 0 to 1
	   S = 0;
	}
	else                                    //Chromatic data...
	{
		if ( L < 0.5 ) 
			S = del_Max / ( var_Max + var_Min );
		else
			S = del_Max / ( 2 - var_Max - var_Min );

	    del_R = ( ( ( var_Max - var_R ) / 6 ) + ( del_Max / 2 ) ) / del_Max
	    del_G = ( ( ( var_Max - var_G ) / 6 ) + ( del_Max / 2 ) ) / del_Max
	    del_B = ( ( ( var_Max - var_B ) / 6 ) + ( del_Max / 2 ) ) / del_Max

	    if ( var_R == var_Max ) 
	    	H = del_B - del_G;
	    else if ( var_G == var_Max ) 
		   H = ( 1 / 3 ) + del_R - del_B;
	    else if ( var_B == var_Max ) 
	    	H = ( 2 / 3 ) + del_G - del_R;

	    if ( H < 0 )
		   H += 1;
	   
	    if ( H > 1 )
	    	H -= 1;
	}
	
	this.hue = H;
	this.saturation = S;
	this.luminosity = L;
	return {
		'hue' : H,
		'sat' : S,
		'lig' : L
	};
};

freakdev.canvas.image.Pixel.prototype.blend = function(px)
{
	if (undefined == this.red)
		this.toRGB();
		
	this.red = (1 - px.alpha) * this.red + px.alpha * px.red;
	this.green = (1 - px.alpha) * this.green + px.alpha * px.green;
	this.blue = (1 - px.alpha) * this.blue + px.alpha * px.blue;
	this.alpha += px.alpha;
	
	return this;
};