wiphoto = {defaults: { navigation_width: 200, thumb_size:120, slideShowSpeed:1}}

wiphoto = {
    defaults: wiphoto.defaults,
    template: {
        'albumLink':
        '<A ID="showThumbs_${album}" CLASS="albumLink" HREF="JAVASCRIPT:showThumbs(${album},0);">${albums[album]["name"]}</A>',
        // ----------------------------------------
        'albumThumb':
        
        '<A HREF="JAVASCRIPT:showThumbs(${album});">'+
            '<SPAN ID="albumThumb_${album}" CLASS="albumThumb">'+
            '<IMG ID="albumThumb_img_${album}" CLASS="albumThumb_img" WIDTH="${dim[0]}" HEIGHT="${dim[1]}" SRC="${photos[albums[album]["photos"][0]]["thumb"]["path"]}">'+
            '<DIV STYLE="WIDTH: ${wiphoto["thumb_size"]+10}">${albums[album]["name"]} (${albums[album]["photos"].length})'+
            '</DIV></SPAN></A>',
        // ----------------------------------------
        'thumb':
        '<A HREF="JAVASCRIPT:wiphoto.photo.setmode(${album},${i});"><IMG ID="thumb_${album}_${i}" CLASS="thumb" WIDTH="${dim[0]}" HEIGHT="${dim[1]}" SRC="${photos[key]["thumb"]["path"]};"></A>',
        // ----------------------------------------
        'photo':
        '<CENTER><IMG WIDTH="${dim[0]}" HEIGHT="${dim[1]}" NAME="SlideShow" ID="showPhoto" SRC="${photos[key]["image"]["path"]}"></CENTER>'
    },
//    album:0, 
    thumb_size: wiphoto.defaults.thumb_size,
    mode: function(mode) {
        if(mode) {
            wiphoto._mode = mode;
            switch (mode) {
            case 'photo':
            case 'thumb': 
            case 'slide': 
                next = wiphoto.photo.next; 
                prev = wiphoto.photo.prev; 
                show = wiphoto.photo.show; 
                play = slideShow.play;
                break;

            case 'albumThumb':
                next = false;
                prev = false;
                play = slideShow.play;
                break;
            }
            if(mode != 'slide') slideShow.stop()
        }
        return (wiphoto._mode)
    },
    // ------------------------------------------------------------
    album: {
        current: 0,
        selected: 0
    },
    // ------------------------------------------------------------
    photo: {
        current: 0,
        show: function (_album,index) {
            wiphoto.photo.current = (index==0) ?0 :(index||wiphoto.photo.current)
            wiphoto.album.current = _album || wiphoto.album.current
	    w = $('viewPanel').clientWidth -20 
	    h = $('viewPanel').clientHeight -20
            key = albums[wiphoto.album.current]['photos'][wiphoto.photo.current];
	    dim = fitInto(w,h,photos[key]['image']);
 	    $('viewPanel').innerHTML = TrimPath.parseTemplate(wiphoto.template.photo).process({'dim':dim, 'key':key, 'photos':photos})
        },
        // --------------------------------------------------------------------------------
        last:    function () { return (albums[wiphoto.album.current].photos.length-1) },
        next:    function () { with(wiphoto.photo) {return ( (current == last()) ? 0 :current+1 ) }},
        prev:    function () { with(wiphoto.photo) {return ( (current == 0) ? last():current-1 ) }},
        setmode: function(_album,index)  { wiphoto.mode('photo'); show(_album,index) }
    },
    // ------------------------------------------------------------
    preload: {},
    // ------------------------------------------------------------
}

    keyCode = { 32:'space',33:'pgup',34:'pgdown',35:'end',36:'home',37:'left',38:'up',39:'right',40:'down',27:'escape',9:'tab',13:'enter',48:'0',
                83:'s'
              };

              
              //     current = { 
              //         photo:0, album:0, thumb_size:wiphoto.defaults.thumb_size,
              //                 mode:function(mode) {
              //                     if(mode) { 
              //                         current._mode = mode;
              
              //                         if(mode != 'slide') slideShow.stop()
              //                     }
              //                     return (current._mode)
              //                 },
              //               };

              // --------------------------------------------------------------------------------
              function getElementsByClassName(classname, node)  {
                  if(!node) node = document.getElementsByTagName("body")[0];
                  var a = [];
                  var re = new RegExp('\\b' + classname + '\\b');
                  var els = node.getElementsByTagName("*");
                  for(var i=0,j=els.length; i<j; i++)
                      if(re.test(els[i].className))a.push(els[i]);
                  return a;
              }
              function get1stElementByClassName(classname, node)  {
                  return (getElementsByClassName(classname, node)[0])
              }
              // --------------------------------------------------------------------------------
              function setThumbSelection (_album,thumb) {
                  elem = $('thumb_'+_album+'_'+thumb);
                  setSelection(elem);
                  if (wiphoto.mode('thumb')) { wiphoto.photo.current = thumb }
              }
              // --------------------------------------------------------------------------------
              function setSelection (elem,cls) {
                  cls = cls || wiphoto.mode();
                  if (elem_s = get1stElementByClassName(cls+' selected',document.body)) { elem_s.className = cls }
                  elem.addClassName('selected');
                  elem.scrollIntoView(false);
              }
              // --------------------------------------------------------------------------------
              function showAlbumThumbs () {
                  wiphoto.mode('albumThumb');
                  template = wiphoto.template;
	          out = '';
                  $('viewPanel').innerHTML = '';
	          for (var album in albums) {
    	              out += TrimPath.parseTemplate(template['albumLink']).process({'album': album, 'albums': albums});
                      dim = fitInto(wiphoto['thumb_size'], wiphoto['thumb_size'], photos[albums[album]['photos'][0]]['thumb']);
                      $('viewPanel').innerHTML += 
                      TrimPath.parseTemplate(template['albumThumb']).process({'wiphoto':wiphoto,'photos':photos,'dim':dim,'album': album, 'albums': albums});
	          }
	          $('albumdata').innerHTML = out
              }

              // --------------------------------------------------------------------------------
              function showThumbs (_album,thumb) {
                  wiphoto.mode('thumb');
                  wiphoto.album.current = _album || wiphoto.album.current;
                  wiphoto.photo.current = (thumb==0) ?0 :(thumb || wiphoto.photo.current); 

                  setSelection( $("showThumbs_"+wiphoto.album.current), 'albumLink'); // left side tab

	          arr = albums[wiphoto.album.current].photos;	
	          $('viewPanel').innerHTML = '';
	          for (var i=0; i< arr.length; i=i+1) {
	              key=arr[i];
                      dim = fitInto(wiphoto.thumb_size, wiphoto.thumb_size, photos[key].thumb);
                      template = wiphoto.template;
	              $('viewPanel').innerHTML +=
	              TrimPath.parseTemplate(template.thumb).process(
		          {'key': key, 'i': i, 'album': wiphoto.album.current, 'photos': photos, "albums": albums, 'dim':dim}
	              )
	          }
                  setThumbSelection(wiphoto.album.current,wiphoto.photo.current);
              }
              // --------------------------------------------------------------------------------
              function selectAlbum(_album) {
                  wiphoto.album.current = _album;
                  setSelection( $("showThumbs_"+wiphoto.album.current), 'albumLink'); // left side tab
                  setSelection( $("albumThumb_img_"+wiphoto.album.current), 'albumThumb_img'); 

              }
              
              function fitInto (w,h,image) { // Container width and height, photo width and height
                  proportion = Math.max(image['dim'][0]/w,image['dim'][1]/h);
	          return([image['dim'][0]/proportion, image['dim'][1]/proportion])
              }
              
              // --------------------------------------------------------------------------------

              function KeyCheck (e) {
                  var KeyPress = (window.event) ? keyCode[event.keyCode] : keyCode[e.keyCode];
                  switch (wiphoto.mode()) {
                  case 'albumThumb':
                      switch(KeyPress) {
                      case 'enter': 
                      case 's': 
                          slideShow.play(); break;
                      case 'space': showThumbs(); break;
                      }
                      break
                  case 'photo':
                      switch(KeyPress) {
                      case 'left': show(null,prev()); break;
                      case 'right': 
                      case 'space':  show(null,next()); break;
                      case 'escape': showThumbs(); break;
                      case 'enter': slideShow.play(); break;
                      }
                      break
                  case 'thumb':
                      switch(KeyPress) {
                      case 'pgup': 
                      case '0':      setThumbSelection(null, 0); break;
                      case 'right':  setThumbSelection(null, next()); break;
                      case 'left':   setThumbSelection(null, prev()); break;
                      case 'pgdown': setThumbSelection(null, last()); break;

                      case 'space': wiphoto.photo.setmode();break;
                      case 'enter': slideShow.play(); break;

                      case 'escape': showAlbumThumbs(); break;
                      }
                      break
                  case 'slide':
                      with (slideShow) {
                          switch(KeyPress) {
                          case 'escape': 
                              if (running) stop()
                              else showThumbs()
                              break;
                          case 'space':
                          case 'enter': toggle(); break;
                          case 'right': show(null, window.next()); break;
                          case 'left':  show(null, window.prev()); break;
                          }
                      }
                  }
                  return (true);
              }
              

              // --------------------------------------------------------------------------------
              function init() {
                  showAlbumThumbs();
                  document.onkeyup = KeyCheck;       
                  wiphoto.mode('albumThumb')
                  selectAlbum(1289);
              }