function reply_(id) {
	//console.log(id);
	concat = '#'.concat(id);
	$(concat).addClass('fa-star').removeClass('fa-star-o');
	$('#'.concat(id)).addClass('ripit');
}


function ajax_test(job_id) {
	//console.log(id);
    $.ajax({
        url: '/add_favorite',
        data: { id : job_id }
    });
}