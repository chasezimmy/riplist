function reply_(id) {
	console.log(id);
	concat = '#'.concat(id);
	$(concat).addClass('fa-star').removeClass('fa-star-o');
	$('#'.concat(id)).addClass('ripit');
}