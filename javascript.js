function carousel(params){
    if(!(params.width>0 && isFinite(params.width)))params.width=100;
    if(!(params.height>0 && isFinite(params.height)))params.height=100;
    if(!(params.sides>2 && isFinite(params.sides)))params.sides=4;
    if(!(params.steps>0 && params.steps<100 && isFinite(params.steps)))params.steps=20;
    if(!(params.speed>0 && isFinite(params.speed)))params.speed=8;
    if(!(params.image_border_width>=0 && isFinite(params.image_border_width)))params.image_border_width=0;
    if(isFinite(params.id)||!params.id)params.id='bad_id_given_'+Math.random();
    var gallerydiv = document.getElementById("rotate-Carousel");
    gallerydiv.innerHTML="<div style='position:relative;overflow:hidden;' id='"+params.id.replace(/[^a-zA-Z0-9]+/g,'_')+"'></div>";
    var cdiv=document.getElementById(params.id.replace(/[^a-zA-Z0-9]+/g,'_'))
    cdiv.style.width=params.width+'px';
    cdiv.style.height=params.height+'px';
    cdiv.style.border=params.border;
    cdiv.style.position='relative';
    cdiv.style.overflow='hidden';
    cdiv.title=params.id;
      
    var counter=0,spinning=true,interval=Math.floor(60000/params.sides/params.steps/params.speed)-5;
    interval=isNaN(interval)?200:interval;
    var img_position=[],images=[],img_dimension=[];
    var img_index=params.images.length+1,img_index_cap=2*params.images.length;
    var faces=Math.ceil(params.sides/2), dimension, direction, targ, attr, faraway;
  
    function init(){
      if(params.direction=="left" || params.direction=="right"){
        direction=params.direction;
        dimension="width";
        }
      else if(params.direction=="top" || params.direction=="bottom"){
        direction=params.direction;
        dimension="height";
        }
      else {
        direction="left";
        dimension="width";
        }      
      faraway=(direction=="left"||direction=="top")?'-20000px':'20000px';
      cdiv.style[dimension]=params[dimension]/(params.size_mode=='image'?Math.sin(Math.PI/params.sides):1)+'px';
      var img=new Image();
      img.style.position='absolute';
      img.style[direction]=faraway;
      img.style.width=params.width-2*params.image_border_width+'px';
      img.style.height=params.height-2*params.image_border_width+'px';
      img.style.border=(params.image_border_width||0)+'px solid '+params.image_border_color;
    
      for(var i=0;i<params.images.length;i++){
        images[i]=img.cloneNode(true);
        images[i].src=params.images[i];
        if(params.links && params.links[i] && params.links[i]!=''){
          targ=params.lnk_targets && params.lnk_targets[i]||params.lnk_base||'new';
          if(targ=="_blank"){
            attr=(params.lnk_attr && params.lnk_attr[i])?",'"+params.lnk_attr[i]+"'":"";
            images[i].onclick=new Function("window.open('"+params.links[i]+"','"+targ+"'"+attr+")");
            }
          else if(targ.substr(0,1)=="_"){
            images[i].onclick=new Function(targ.substr(1)+".location='"+params.links[i]+"'");
            }
          else{
            attr=(params.lnk_attr && params.lnk_attr[i])?",'"+params.lnk_attr[i]+"'":"";
            images[i].onclick=new Function("var t='"+targ+"';if(window[t]){try{window[t].close()}catch(z){}}window[t]=window.open('"+params.links[i]+"',t"+attr+");window[t].focus()");
            }
          images[i].style.cursor=document.all?'hand':'pointer';
          }
  
        if(params.titles && params.titles[i] && params.titles[i]!='')
          images[i].title=params.titles[i];
        if(document.all)
          images[i].alt=images[i].title;
        images[i+params.images.length]=images[i];
        if(params.images.length==faces)
          images[i+2*params.images.length]=images[i];
        cdiv.appendChild(images[i]);
        }
    
      var face_size=params.size_mode=='image'?params[dimension]:params[dimension]*Math.sin(Math.PI/params.sides);
      var face_offset=params[dimension]*Math.cos(Math.PI/params.sides)/(params.size_mode=='image'?Math.sin(Math.PI/params.sides):1)/2-.5;
      var pi_piece=2*Math.PI/params.steps/params.sides;
      for(i=0;i<=params.steps*faces;i++){
        img_dimension[i]=face_size*Math.sin(pi_piece*i);
        img_position[i]=(i<params.steps*params.sides/2)?Math.floor(params[dimension]/2/(params.size_mode=='image'?Math.sin(Math.PI/params.sides):1)-face_offset*Math.cos(pi_piece*i)-img_dimension[i]/2)+'px':faraway;
        img_dimension[i]=img_dimension[i]-2*params.image_border_width>1?Math.ceil(img_dimension[i])-2*params.image_border_width+'px':'1px';
        }
      }
    init();
  
    cdiv.rotate = function(){
      setTimeout('document.getElementById("'+cdiv.id+'").rotate()',interval);
      if(!spinning) return;
      if(++counter>=params.steps){
        counter=0;
        if(++img_index>=img_index_cap)
          img_index=params.images.length;
        }
      images[img_index-faces].style[direction]=faraway;
      for(var i=faces-1;i>=0;i--){
        images[img_index-i].style[direction]=img_position[counter+i*params.steps];
        images[img_index-i].style[dimension]=img_dimension[counter+i*params.steps];
        }
      }
    cdiv.onmouseover=function(){
      spinning=false;
      }
    cdiv.onmouseout=function(){
      spinning=true;
      }
    setTimeout('document.getElementById("'+cdiv.id+'").rotate()',100);
    }