const allBreeds = [];
const myCollection = [];
let picUrl = '';
 


// return each dog picture
function getImage(breed) {
  $.ajax({
    url: `https://dog.ceo/api/breed/${breed}/images/random`,
    type: 'GET',
    datatype: 'json',
    cache: false,
    // async: false,
    success(data) {
      picUrl = data.message;
    },
    error() { 
      picUrl = 'https://web.mo.gov/doc/PuppiesForParolePublic/images/noPhoto.png';
    },
  });
  return picUrl;
}


// return each dog html div
function returnDogHtml(breed, subbreed, picture) {
  const eachDog = (`<div class="eachdog" id="${breed}-${subbreed}">`
    + `<div class="name"><span id="name">${breed}</span>: ${subbreed}</div>`
    + '<div class="body">'
    + `<div id=${subbreed} class="picture" ><img src="${picture}" alt="${subbreed} picture" ></img></div>`
    + '</div>'
    + `<div class="bttnsdiv" id="${breed}-${subbreed}">`
    + '<button class="eachbutton addbtn" id="add-dog">add</button>'
    + '<button class="eachbutton delbtn" id="del-dog" >delete</button>'
    + '</div>' + '</div>');

  return eachDog;
}


// populate the webpage on load
function getAll() {
  $.ajax({
    url: 'https://dog.ceo/api/breeds/list/all',
    type: 'GET',
    datatype: 'json',
    cache: false,
    success(data) {
      let eachDog = '';
      const eachDogMain = '';
      let picture = '';
      const key = Object.keys(data.message);
      const val = Object.values(data.message);

      for (const prop in Object.values(data.message)) {
        const breed = key[prop];
        let subbreed = '';
        const subbreeds = val[prop].length;
        if (subbreeds > 0) {
          for (let i = 0; i < subbreeds; i++) {
            subbreed = val[prop][i];

            // add all available dog breeds to an array
            allBreeds.push(`${breed} ${subbreed}`);
            picture = getImage(breed);
            // results
            eachDog += returnDogHtml(breed, subbreed, picture);
          }

          $('#all').append(eachDog);

          eachDog = [...eachDogMain];
        }
      }
    },
  });
}


 
  // search for dog
  $('#input').keyup(function () {
    document.getElementById('searchresult').innerHTML = ' ';
    const searchEntered = $(this).val();
    const lowerCaseSearchEntered = searchEntered.toLowerCase();

    if (searchEntered.length > 3) {
      searchForDog(lowerCaseSearchEntered);
    }
  });

  function searchForDog(name) {
    let eachDog = '';
    let picture = '';

    for (let i = 0; i < allBreeds.length; i++) {
      const isPresent = allBreeds[i].includes(name);
      if (isPresent == true) {
        const namearr = allBreeds[i].split(' ');
        const breed = namearr[0];
        const subbreed = namearr[1];
        picture = getImage(breed);
        eachDog += returnDogHtml(breed, subbreed, picture);
      }
    } 

    showModal();
    $('#searchresult').append(eachDog);
  }


  // add a dog to my collection
  $('#myModal').delegate('#add-dog', 'click', function () {
    const div = $(this).parent().attr('id');
    addDogtoCollection(div);
  });
  $('.breed').delegate('#add-dog', 'click', function () {
    const div = $(this).parent().attr('id'); 
    addDogtoCollection(div);
  });


  function addDogtoCollection(div) {
    let eachDog = '';
    // let div = $(this).parent().attr("id");
    const dog = div.split('-').join(' ');
    const namearr = div.split('-');
    const breed = namearr[0];
    const subbreed = namearr[1];

    // is it already saved?
    const index = myCollection.indexOf(dog);

    if (index < 0) {
      const picture = getImage(breed);

      eachDog += returnDogHtml(breed, subbreed, picture);

      // change ui buttons
      $('#justadded').append(eachDog);
      $('.breed').css('width', '60%');
      $('.mycollection').css('display', 'inline-block');
      $('.mycollection').css('width', '38%');

      $('body').find('.mycollection').css('border', 'green solid 2px');
      $('body').find('.mycollection').css('border-top', 'none');
      $('body').find('.mycollection').css('border-bottom', 'none');

      // add dog to my dog collection
      myCollection.push(dog);
    } else {
      // change ui buttons
      $(`#${div}`).find('#add-dog').css('background-color', 'red');
      $(`#${div}`).find('#add-dog').text('Already added');
      $(`#${div}`).find('#add-dog').css('color', 'white');
    }
  }


  // delete from my collection
  $('.mycollection').delegate('#del-dog', 'click', function () {
    const name = $(this).closest('.eachdog').attr('id');
    const dog = name.split('-').join(' ');
    const index = myCollection.indexOf(dog);
    myCollection.splice(index, 1);

    // change ui buttons
    $(this).closest('.eachdog').hide();
    $(`#${name}`).find('#add-dog').text('add');
    $(`#${name}`).find('#add-dog').css('color', 'black');
    $(`#${name}`).find('#add-dog').css('background-color', 'white');

    // hide mycollection if i have no dogs
    if (myCollection.length < 1) {
      $('.mycollection').css('display', 'none');
      $('.breed').css('width', '99%');
      $('.breed').css('display', 'inline-block');
    }

    // show random button
    let mylen = myCollection.length;
    let allbreedslen = allBreeds.length;
    if (mylen < allbreedslen ) {    
        $('#rand-dog').css('display','inline'); 
    } 
    
  });
 

function showModal() {
  const modal = document.getElementById('myModal');
  const btn = document.getElementById('myBtn');
  const span = document.getElementsByClassName('close')[0];
  modal.style.display = 'block';
}

$('body').delegate('.close', 'click', () => {
  $('#myModal').hide();
  $('#input').val('');
});


// add a random dog
$('#rand-dog').click(function(){  
    let num;
    let randomDog = '';
    let index;
    let alllen = allBreeds.length;
    let mylen = myCollection.length
     
    // is it already saved?
    function returnUnaddedDogindex(){ 
        num = Math.floor((Math.random() * alllen));
        randomDog = allBreeds[num];
        index = myCollection.indexOf(randomDog);
    return index;
    }

    index = returnUnaddedDogindex();

    while(index > 0){ 
        index = returnUnaddedDogindex();  
        if (alllen == mylen ) {  
            index == -1;   
            $('#rand-dog').css('display','none');
        } 
    } 

    let dog = randomDog.split(' ').join('-'); 
    addDogtoCollection(dog);
});