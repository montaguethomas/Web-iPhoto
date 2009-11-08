
photo = [];
screen = [];

key = {'left':37,'up': 38,'right': 39,'down': 40,'escape':27,'tab':9,'enter':13,'space':32};
defaults = { 'navigation_width': 200, 'thumb_size': 120 };
template = {
    'albumLink':'<A ID="showThumbs_${album}" CLASS="albumLink" HREF="JAVASCRIPT:showThumbs(${album});">${albums[album]["name"]}</A>',
    'albumThumb':'<A HREF="JAVASCRIPT:showThumbs(${album});"><SPAN ID="albumThumb_${album}" CLASS="albumThumb"><IMG WIDTH="${dim[0]}" HEIGHT="${dim[1]}" SRC="${photos[albums[album]["photos"][0]]["thumb"]["path"]}"><DIV STYLE="WIDTH: ${current["thumb_size"]+10}">${albums[album]["name"]} (${albums[album]["photos"].length})</DIV></SPAN></A>',
    'thumb':'<A HREF="JAVASCRIPT:showPhoto(${album},${i});"><IMG CLASS="thumb" WIDTH="${dim[0]}" HEIGHT="${dim[1]}" SRC="${photos[key]["thumb"]["path"]};"></A>',
    'photo':'<CENTER><IMG WIDTH="${dim[0]}" HEIGHT="${dim[1]}" ID="showPhoto" SRC="${photos[key]["image"]["path"]}"></CENTER>'
};
    
    current = { 'photo':[], 'album': 0, 'mode':'',
                thumb_size : defaults['thumb_size']
              };
    document.onkeyup = KeyCheck;       
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

    // --------------------------------------------------------------------------------
    function populateAlbums () {
        current['mode'] = 'albumThumbs';
	out = '';
        document.getElementById('viewPanel').innerHTML = '';
	for (var album in albums) {
    	    out += TrimPath.parseTemplate(template['albumLink']).process({'album': album, 'albums': albums});
            dim = fitInto(current['thumb_size'], current['thumb_size'], photos[albums[album]['photos'][0]]['thumb']);
            document.getElementById('viewPanel').innerHTML += 
            TrimPath.parseTemplate(template['albumThumb']).process({'current':current,'photos':photos,'dim':dim,'album': album, 'albums': albums});
	}
	document.getElementById('albumdata').innerHTML = out
    }

    // --------------------------------------------------------------------------------
    function showThumbs (album) {
        current['mode'] = 'thumbs';
        current['album'] = album;
	arr = albums[album]['photos'];

	elem = getElementsByClassName('selected', document.body)[0]
	if (elem) { elem.className = 'albumLink' }

	document.getElementById("showThumbs_"+album).className = 'selected';
	
	document.getElementById('viewPanel').innerHTML = '';
	for (var i=0; i< arr.length; i=i+1) {
	    key=arr[i];
            dim = fitInto(current['thumb_size'], current['thumb_size'], photos[key]['thumb']);
	    document.getElementById('viewPanel').innerHTML +=
	    TrimPath.parseTemplate(template['thumb']).process(
		{'key': key, 'i': i, 'album': album, 'photos': photos, "albums": albums, 'dim':dim}
	    )
	}
    }
    // --------------------------------------------------------------------------------
    
    function fitInto (w,h,image) { // Container width and height, photo width and height
	proportion = 1;
        pw = image['dim'][0]; ph = image['dim'][1];
	p1 = pw/w; p2 = ph/h;
	if ( p1 > p2) { 
	    proportion = p1 
	} else {
	    proportion = p2
	}
	dim = [ pw/proportion, ph/proportion];
	return (dim);
    }
    
    // --------------------------------------------------------------------------------
    function showPhoto (album,index) {
        current['photo'] = [album,index];
        current['album'] = album;
        current['mode'] = 'photo';
	w = document.getElementById('viewPanel').clientWidth -20 
	h = document.getElementById('viewPanel').clientHeight -20
        key = albums[album]['photos'][index];
	dim = fitInto(w,h,photos[key]['image']);
 	document.getElementById('viewPanel').innerHTML = 
	    TrimPath.parseTemplate(template['photo']).process({'dim':dim, 'key':key, 'photos':photos})
    }
    // --------------------------------------------------------------------------------
    function next () {
        //current['photo'][0] - album index
        //current['photo'][1] - photo index in album
        nextIdx = (current['photo'][1] == albums[current['photo'][0]]['photos'].length-1) ? 0 : current['photo'][1]+1
        showPhoto (current['photo'][0], nextIdx)
    }

    function prev () {
        nextIdx = (current['photo'][1] == 0) ? albums[current['photo'][0]]['photos'].length-1 : current['photo'][1]-1
        showPhoto (current['photo'][0], nextIdx)
    }

//'left':37,'up': 38,'right': 39,'down': 40,'escape':27,'tab':9,'enter':13,'space':32};
    function KeyCheck (e) {
        var KeyID = (window.event) ? event.keyCode : e.keyCode;
        switch (current['mode']) {
        case 'photo':
            switch(KeyID) {
            case 37: prev(); break;
            case 39: next(); break;
            case 32: next(); break;
            case 27: showThumbs(current['album']); break;
            }
            break
        case 'thumbs':
            album = current['album']
            switch(KeyID) {
            case 39: showPhoto(album,0); break;
            case 37: showPhoto(album,albums[album]['photos'].length-1); break;
            case 32: showPhoto(album,0); break;
            case 27: populateAlbums(); break;
            }
            break
        case 'albumThumbs':
            break
        }
        return (true);
    }
    
