module.exports.newPriceBook = (books) => {
    const newBooks = books.map(book => {
        book.newPrice = (book.price - (book.price * (book.discountPercent / 100))).toFixed(0);
        return book;
    });
    return newBooks;
}


module.exports.newPriceOneBook = (book) => {
    book.newPrice = parseInt((book.price - (book.price * (book.discountPercent / 100))).toFixed(0));
}