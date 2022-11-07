document.querySelector('#clickMe').addEventListener('click', makeReq)
var trash = document.getElementsByClassName("fa-trash-o");

function makeReq(){
  // read the word from index.ejs
  const input = document.querySelector("#string").value;
  let result = "false";

  //it is a get call since it is a default fetch, option has not been passed in the method
  fetch(`/palindromecheck?word=${input}`)
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      result = data.result;
    })
    // wait for the first call to finish before
    // making the second call
    .then(() => {
      fetch("/palindromesave",
      // these are the options
      {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify({word: input, dbResult: result})
      })
    })
    .then(() => {
      window.location.reload();
    })

}

Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(){
    const userWordinput = this.parentNode.parentNode.childNodes[1].innerText
    const userResults = this.parentNode.parentNode.childNodes[3].innerText
    fetch('delete', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        deleteWord: userWordinput,
        deleteResult: userResults
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});



