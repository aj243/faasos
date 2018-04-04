$(document).ready(function () {
	var socket = io.connect('http://127.0.0.1:1337');

	$(".doneButton").click(function () {
		var id = $(this).val();
		var trRef = $(this).parents('tr').attr('id');
		io.socket.get('/product/change', {
			value: id,
			ref: trRef
		}, function (res) {
			console.log("data got socket request = ", res);
		});

	});
	io.socket.on('message', function (data) {
		var trRef = $(`#${data.ref}`);
		trRef.children('td:eq(2)').text('0');
		trRef.children('td:eq(3)').text(data.createdTillNow);
		trRef.find('button').attr('disabled', 'disabled');
		console.log("data changed to", data);
	});

	io.socket.get('/watchProduct', function (res) {
		console.log("status of watchProduct", res);
	});

	io.socket.on('product', function (event) {
		var trRef = $(`#${event.id}`);
		trRef.children('td:eq(2)').text(event.data.productQty);
		trRef.find('button').removeAttr('disabled');
		console.log("Got some changes to product", event);
	});

	$("#reportButton").click(function (e) {
		e.preventDefault();
		window.open('https://dalviroo-kitchen.herokuapp.com/createPdf', '_blank');
	});

});
