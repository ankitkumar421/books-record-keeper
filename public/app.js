// getting api for rendering book data from DB
fetch('http://localhost:3000/all-book')
.then(Response => {
    return Response.json();
}).then(allBook => {
        allBook.forEach(element => {
                let bookRow = document.createElement('tr');
                bookRow.setAttribute('id', element.id);
                let bookID = document.createElement('th');
                bookID.setAttribute('scope', 'row');
                bookID.innerHTML = element.id;
                document.querySelector('tbody').appendChild(bookRow);
        
                let bookNameRow = document.createElement('td');
                bookNameRow.innerHTML = element.name;
                bookRow.appendChild(bookNameRow);
        
                let bookAuthor = document.createElement('td');
                bookAuthor.innerHTML =  element.author;
                bookRow.appendChild(bookAuthor);
        
                let bookPrice = document.createElement('td');
                bookPrice.innerHTML =  element.price;
                bookRow.appendChild(bookPrice);
        
                let bookCategory = document.createElement('td');
                bookCategory.innerHTML =  element.category;
                bookRow.appendChild(bookCategory);
        
                let bookAvilable = document.createElement('td');
                var apiAvilableValue = element.isActive;
                if (apiAvilableValue == true){
                    bookAvilable.innerHTML = 'YES'
                }else{
                bookAvilable.innerHTML =  'NO';
                }
                bookRow.appendChild(bookAvilable);
                let bookEdit = document.createElement('td');
                bookRow.appendChild(bookEdit);
                let delBtn = document.createElement('button');
                delBtn.addEventListener('click', deleteBook);
                delBtn.setAttribute('class', "x deleteModal");
                let btnText = document.createTextNode('DELETE');
                delBtn.appendChild(btnText);
                bookEdit.appendChild(delBtn);
                let updateBtn = document.createElement('button');   
                updateBtn.setAttribute('class', 'updateModal');
                updateBtn.setAttribute('data-toggle', 'modal');
                updateBtn.setAttribute('data-target', '#exampleModal');
                updateBtn.addEventListener('click', fetchSelectedDatass);
                let updatebtnText = document.createTextNode('UPDATE');
                updateBtn.appendChild(updatebtnText);
                bookEdit.appendChild(updateBtn);
             });
});

document.getElementById('updatemyAnchor').addEventListener('click', updateBookModal);
function updateBookModal(event){
        event.preventDefault()
        var categoryValue = document.getElementById("updatecategorySelect");
        var bookCategory = categoryValue.options[categoryValue.selectedIndex].text;
        var isAvilableValue = document.getElementById('updateisAvilable');
        var isAvilable = isAvilableValue.options[isAvilableValue.selectedIndex].text;
            if (isAvilable === "yes"){
                    isAvilable = true
                }else{
                    isAvilable = false
                 }

            updateObj = {
                "id": document.getElementById('bookId').value,
                "name": document.getElementById('updateBookname').value,
                "author": document.getElementById('updateauthorname').value,
                "price": document.getElementById('updatebookprice').value,
                "category": bookCategory,
                "isActive": isAvilable      
        };

// Sending Updated Values to DB
fetch('http://localhost:3000/update-book',{
        method: 'POST',
        body: JSON.stringify(updateObj),
        headers: {"Content-type": "application/json; charset=UTF-8"}   
    }
)};

// Getting data on click of update button
function fetchSelectedDatass() { 
            bookId = this.parentNode.parentNode.id;
     fetch(`http://localhost:3000/book/${bookId}`)
    .then(Response => {
     return Response.json();
        }).then(bookObj => {
                document.getElementById('bookId').value = bookObj._id;
                document.getElementById('updateBookname').value = bookObj.name;
                document.getElementById('updateauthorname').value = bookObj.author;
                document.getElementById('updatebookprice').value = bookObj.price;
                document.getElementById("updatecategorySelect").value = bookObj.category;
                document.getElementById("updateisAvilable").value = bookObj.isActive;
            });
        }

// Getting Id on click of delete button
function deleteBook(){
    let deleteDiv = this.parentNode.parentNode.id;
    let deleteBookObj = {
        "id": deleteDiv
}

// Seding Id to delete book from DB
fetch('http://localhost:3000/delete-book', {
    method: 'POST',
    body: JSON.stringify(deleteBookObj),
    headers: {"Content-type": "application/json; charset=UTF-8"}   
});
    this.parentNode.parentNode.remove();
}

// Removing the add book form
function removedisplay(){
    document.getElementById('displayform').style.display= 'block';
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("addBtn");
// var btn = document.getElementById('updateModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Ggetting Values for adding books
document.getElementById("myAnchor").addEventListener("click", function(event){
    let bookname = document.getElementById('bookname').value;
    let authorname = document.getElementById('authorname').value;
    var categoryValue = document.getElementById("categorySelect");
    var bookCategory = categoryValue.options[categoryValue.selectedIndex].text;
    let bookPrice = document.getElementById('bookprice').value;
    var isAvilableValue = document.getElementById('isAvilable');
    var isAvilable = isAvilableValue.options[isAvilableValue.selectedIndex].text;
    if (isAvilable === "yes"){
        isAvilable = true
    }else{
        isAvilable = false
    }
    let formObj = {
                "name": bookname,
                "author": authorname,
                "price": bookPrice,
                "category": bookCategory,
                "isActive": isAvilable
            };
            fetch('http://localhost:3000/addbook', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formObj)
              })
  });

  document.getElementById('modalForm').reset();

  // For search box
 document.getElementById('searchBtn').addEventListener('click', searchValue);
 function searchValue(event){
     event.preventDefault()
    let searchText = document.getElementById('searchText').value;
    let removeTable = document.getElementById('book-list');
    if(removeTable) {
        removeTable.remove();
    }
    fetch(`http://localhost:3000/search-book/?bookname=${searchText}`)
    .then(Response => {
        return Response.json();
    }).then(searchBookDetails => {
        debugger;
        if (searchBookDetails.length == 0){
            if(removeTable) {
                removeTable.remove();
            }
            if (!document.getElementById('no-result')) {
                let notFound = document.createElement('p');
                notFound.setAttribute('id', 'no-result');
                notFound.innerHTML = "Book Not Found";
                document.body.appendChild(notFound);
            }
        }else{
            searchBookDetails.forEach(e => {
                console.log(e);
                if(document.getElementById('no-result')) {
                    document.getElementById('no-result').remove();
                }
                let tableBody = document.createElement('tbody');
                tableBody.setAttribute('id', 'book-list');
                document.getElementById('bookTable').appendChild(tableBody);
                let bookRow = document.createElement('tr');
                bookRow.setAttribute('id', e._id);
                let bookID = document.createElement('th');
                bookID.setAttribute('scope', 'row');
                bookID.innerHTML = e._id;
                document.querySelector('tbody').appendChild(bookRow);

                let bookNameRow = document.createElement('td');
                bookNameRow.innerHTML = e.name;
                bookRow.appendChild(bookNameRow);

                let bookAuthor = document.createElement('td');
                bookAuthor.innerHTML =  e.author;
                bookRow.appendChild(bookAuthor);
        
                let bookPrice = document.createElement('td');
                bookPrice.innerHTML =  e.price;
                bookRow.appendChild(bookPrice);
        
                let bookCategory = document.createElement('td');
                bookCategory.innerHTML =  e.category;
                bookRow.appendChild(bookCategory);
        
                let bookAvilable = document.createElement('td');
                var apiAvilableValue = e.isActive;
                if (apiAvilableValue == true){
                    bookAvilable.innerHTML = 'YES'
                }else{
                bookAvilable.innerHTML =  'NO';
                }
                bookRow.appendChild(bookAvilable);
                let bookEdit = document.createElement('td');
                bookRow.appendChild(bookEdit);
                let delBtn = document.createElement('button');
                delBtn.addEventListener('click', deleteBook);
                delBtn.setAttribute('class', "x deleteModal");
                let btnText = document.createTextNode('DELETE');    
                delBtn.appendChild(btnText);
                bookEdit.appendChild(delBtn);
                let updateBtn = document.createElement('button');   
                updateBtn.setAttribute('class', 'updateModal');
                updateBtn.setAttribute('data-toggle', 'modal');
                updateBtn.setAttribute('data-target', '#exampleModal');
                updateBtn.addEventListener('click', fetchSelectedDatass);
                let updatebtnText = document.createTextNode('UPDATE');
                updateBtn.appendChild(updatebtnText);
                bookEdit.appendChild(updateBtn);
             });
        }
     });
 }

 



 




