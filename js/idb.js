if (!('indexedDB' in window)) {
  console.log('This browser doesn\'t support IndexedDB');
}

var db;
var openRequest = indexedDB.open('kklp', 1);

openRequest.onupgradeneeded = function(e) {
  var db = e.target.result;
  console.log('running onupgradeneeded');
  if (!db.objectStoreNames.contains('laporan')) {
    var storeOS = db.createObjectStore('laporan', {keyPath: 'id', autoIncrement : true });
    storeOS.objectStore
  }
};

openRequest.onsuccess = function(e) {
  console.log('running onsuccess');
  db = e.target.result; 
};

function addItem(ket) {
  var username = getCookie("username");
  console.log(username);
  var item = {
    nama: username,
    kegiatan: ket,
    tanggal: new Date()
  };
  var transaction = db.transaction(['laporan'], 'readwrite');
  var store = transaction.objectStore('laporan');

  store.add(item);
  console.log('Berhasil Menyimpan !');
  return transaction.complete;
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function hapus(id) {
  var request = db.transaction(["laporan"], "readwrite")
                .objectStore("laporan")
                .delete(id);
  request.onsuccess = function(event) {
    $("#laporan-"+id).css("display","none");
  };
}

var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

function read() {
  var laporan = "";
  var dbRequest = indexedDB.open('kklp',1);
  dbRequest.onsuccess = function(event) {
    var db = this.result;
    var db = dbRequest.result;
    var db = event.target.result;

    console.log('Got a db connection! It is %s', db);

    // Now, INSIDE THE BLOCK OF THIS FUNCTION ONLY, do something:
    var myTransaction = db.transaction('laporan','readwrite');
    var myObjectStore = myTransaction.objectStore('laporan');

    myObjectStore.openCursor(null,'prev').onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        laporan += 
        `<div class="laporan" id="laporan-${cursor.key}">`+
        '  <div class="row">'+
        '    <div class="col">'+
        `      <h6>${cursor.value.nama}</h6>`+
        `      <p>${cursor.value.tanggal.getDate()} ${month[cursor.value.tanggal.getMonth()]} ${cursor.value.tanggal.getFullYear()} ${cursor.value.tanggal.getHours()}:${cursor.value.tanggal.getMinutes()}:${cursor.value.tanggal.getSeconds()}</p>` +
        '    </div>'+
        '    <div class="col-4 pt-2">'+
        '      <button class="btn btn-danger" type="button" '+
        '              data-toggle="modal" data-target="#HapusLaporan" '+
        `              data-id="${cursor.key}"><i class="fas fa-trash"></i> Hapus</button>`+
        '    </div>'+
        '  </div>'+
        '  <div class="row">'+
        '    <div class="col kegiatan">'+
        '      <p>Kegiatan :</p>'+
        '      <i>'+cursor.value.kegiatan+'</i>'+
        '    </div>'+
        '  </div>'+
        '</div>';
        cursor.continue();
        $("#data").html(laporan);
      }
      else {
        console.log("No more entries!");
      }
    };
  };
}