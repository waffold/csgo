function $(a) {
	return document.querySelector(a);
}

document.addEventListener("DOMContentLoaded", function() {
	rendUpgrades();
	rendCash();

	$('#clicker').addEventListener('mousedown', function(e) {
		e.preventDefault();
		$('#clicker-text').style.transform = 'scale(1.2)';
		earn(e);
	});
	$('#clicker').addEventListener('mouseup', function(e) {
		e.preventDefault();
		$('#clicker-text').style.transform = 'scale(1)';
	});

	$('#inv-prev').addEventListener('click', function() {
		let page = $('#inv-page-n').innerHTML;
		if(page > 1) {
			$('#inv-page-n').innerHTML = Number(page) -1;
			rendInv();
		}
	})
	
	$('#inv-next').addEventListener('click', function() {
		let page = $('#inv-page-n').innerHTML
		let items = document.getElementsByClassName('item');
		let cap = Math.ceil(user.inv.length/getItemsPerPage());
		if(page < cap) {
			$('#inv-page-n').innerHTML = Number(page) + 1;
			rendInv();
		}
	})
});

// Clicks per second

let user = {
	"cash": 0,
	"cpc" : 1,
	"upgrades" : {
		"+cash" : 1,
		"luck" : 1
	},
	"inv" : [
		{name : "Karambit | Gamma Doppler", stattrak : true, t : 'FN'},
		{name : "Butterfly | Fade", stattrak : false, t : 'MW'},
		{name : "Spectrum Case", stattrak: false, t: "u"},
		{name : "Spectrum Case Key", stattrak: false, t: "u"},
		{name : "Stilleto | Forest DDPAT", stattrak : true, t : 'WW'},
		{name : "M4A1-S | Vaporwave", stattrak : true, t : 'BS'},
		{name : "AWP | Atheris", stattrak : false, t : 'FT'},
		{name: "Spectrum Case 2", stattrak : false, t : "u"}
	]
}

let upgrades = {
	"+cash" : {"max" : 10, "cost" : 76, "costscale" : 1.5},
	"luck" : {"max" : 10, "cost" : 83, "costscale" : 1.6}
}

let tToMult = {
	'FN' : 1.8,
	'MW' : 1.6,
	'FT' : 1.4,
	'WW' : 1.2,
	'BS' : 1,
	'u' : 1,
}

let gitems = [
	//cases
	{name: 'Gamma Case', price: 0.75,  case: 'gamma', class: 'standard', type: 'case'}, 
	{name: 'Spectrum Case', price: 2.50, case: 'spectrum', class: 'standard', type: 'case'}, 
	{name: 'Spectrum Case 2', price: 1.50, case: 'spectrum2', class: 'standard', type: 'case'},

	//Gamma Case
	{name: "M4A1-S | Vaporwave", price: 144.32, class: "covert", case: "gamma", type: "skin", stattrak: false},
	{name: "Karambit | Gamma Doppler", price: 3456.70, class: "exceedingly_rare", case: "gamma", type: "skin", stattrak: false},
	{name: "Butterfly | Fade", price: 1459.4, class: "exceedingly_rare", case: "gamma", type: "skin", stattrak: false},
	{name: "Stilleto | Forest DDPAT", price: 180.76, class: "exceedingly_rare", case: "gamma", type: "skin", stattrak: false},
	{name: "AWP | Atheris", price: 13.45, class: "restricted", case: "gamma", type: "skin", stattrak: false},

	//Keys
	{name: "Spectrum Case 2 Key", price: 1.75, class: "standard", case: "spectrum2", type: "key"},
	{name: "Spectrum Case Key", price: 2.40, class: "standard", case: "spectrum", type: "key"},
	{name: "Gamma Case Key", price: 1.75, class: "standard", case: "gamma", type: "key"}
	
]

function rendUpgrades() {
	let ub = document.getElementsByClassName("upgrade-button");
	for(let i=0; i<ub.length; i++) {
		let bid= ub[i].id;
		ub[i].innerHTML = "Buy: $" + upgrades[bid].cost;
		if(user.upgrades[bid] == upgrades[bid].max) {ub[i].innerHTML = "MAX";}
	}

	let ul = document.getElementsByClassName("upgrade-amount");
	for(let i=0; i<ul.length; i++) {
		ul[i].innerHTML = "Level: " + user.upgrades[ul[i].id];
	}
}

function rendCash()	 {
	user.cash = Number(user.cash.toFixed(2));
	$('#cash_text').innerHTML = "Cash: " + user.cash.toString();

	let total = 0;
	for(let i = 0; i < user.inv.length; i++) {
		let data = getItemData(user.inv[i].name);
		total += data.price * tToMult[user.inv[i].t];
	}
	$('#value_text').innerHTML = "Value: $" + total.toFixed(2);
}

function rendInv() {
	let ei = document.getElementsByClassName('inv-item');
	$("#inv-items").innerHTML = "";
	let pp = getItemsPerPage();
	let items = [];
	let page = $('#inv-page-n').innerHTML;
	for(let i = 0; i < user.inv.length; i++) {
		let data = getItemData(user.inv[i].name);
		let price = data.price * tToMult[user.inv[i].t];
		let np = (i)/pp;

		let div = document.createElement("div");
		div.className = "item";
		div.setAttribute("n", i);
		div.setAttribute('p', Math.floor(np));

		let inner = document.createElement("div");
		inner.className = "item-inner " + data.class + ' ' + user.inv[i].t;
		inner.innerHTML = '<img class="inner-image ' + data.type + '" src="https://raw.githubusercontent.com/waffold/csgo/main/images/' + data.name.replace(" | ", '').replace(' ', '').replace(' ', '').replace(' ', '') + '.png" alt="My Image">';
		if(user.inv[i].stattrak) {
			let st = document.createElement('div');
			st.className = 'stattrak';
			inner.appendChild(st);
		}
		inner.addEventListener('click', function() {
			showPopup('item-info', user.inv[i]);
		})
	
		let itemActions = document.createElement('div');
		itemActions.className = 'itemActions';
	
		let title = document.createElement('div');
		title.className = 'item-title';
		title.innerHTML = data.name;
		inner.appendChild(title);
		
		let sb = document.createElement('button');
		sb.innerHTML = "Sell $" + price.toFixed(2);
		sb.className = "item-b";
		let isCase = data.type == 'case';
		if(data.type == 'skin') {
			sb.classList.add("item-sell")
			let w = document.createElement('span');
			w.className = "inv-item-wear";
			w.innerHTML = user.inv[i].t;
			inner.appendChild(w);
			itemActions.appendChild(sb);
		}
		if(data.type == 'case') {
			sb.classList.add('case-sell');
			let ob = document.createElement('button');
			ob.innerHTML = "Open";
			ob.className = "item-b case-open";
			ob.addEventListener('click', function() {
				showPopup('open-case', user.inv[i]);
			})
			itemActions.appendChild(ob);

		}
		if(data.type == 'key') {
			sb.classList.add("item-sell");
		}
		
		div.appendChild(inner);
		div.appendChild(itemActions);
		itemActions.insertBefore(sb, itemActions.firstChild);
		sb.addEventListener('click', function() {
			let a = sb.parentNode.parentNode.getAttribute("n");
			let data = getItemData(user.inv[a].name);
			let price = data.price * tToMult[user.inv[a].t];

			user.cash += price;
			user.inv.splice(a, 1);

			sb.parentNode.parentNode.parentNode.removeChild(sb.parentNode.parentNode);

			rendCash();
			getLastPage();
			rendInv();
		})
		items.push(div);
		
	}
	let vi = items.filter(el => el.getAttribute("p") == Number(page)-1);
	for(let i = 0; i < vi.length; i++) {
		$('#inv-items').appendChild(vi[i]);
	}
}

function rendShop() {
	$('#shop-items').innerHTML = '';
	let items = [];
	for(let i = 0; i < gitems.length; i ++) {
		if(gitems[i].type == 'case') {
			let data = getItemData(gitems[i].name);
			let div = document.createElement('div');
			let price = data.price;
			div.className = "item";
			div.setAttribute('n', i);

			let inner = document.createElement('div');
			inner.className = "item-inner " + data.class;
			inner.innerHTML = '<img class="inner-image case" src="https://raw.githubusercontent.com/waffold/csgo/main/images/' + data.name.replace(" | ", '').replace(' ', '').replace(' ', '') + '.png" alt="skin">';
			inner.addEventListener('click', function() {
				showPopup('case-info', data);
			})

			let title = document.createElement('div');
			title.className = 'item-title';
			title.innerHTML = data.name;

			inner.appendChild(title);

			div.appendChild(inner);

			let itemActions = document.createElement('div');
			itemActions.className = 'itemActions';

			let bb = document.createElement('button');
			bb.className = 'item-b item-sell';
			bb.innerHTML = "Buy: $" + price;
			bb.addEventListener('click', function() {
				let n = bb.parentNode.parentNode.getAttribute("n");
				let a = getItemData(gitems[n].name);
				if(user.cash >= a.price) {
					user.inv.push({
						name: a.name,
						stattrak: false,
						t: 'u'
					});
					user.cash -= a.price;

					rendCash();
				}

			})
			itemActions.appendChild(bb);
			div.appendChild(itemActions);
			items.push(div);
			$('#shop-items').appendChild(div);
		}
	}
}


function earn(e) {
	if($('#earn-page').className == "page show") {
		let r = Number((Math.random()*user.upgrades['+cash']).toFixed(2));
		user.cash += r;
		
		rendCash();
		
		let div = document.createElement('div');
		div.innerHTML = "+ $" + r;
		div.className = 'fadeup';

		setTimeout(function() {
			div.parentNode.removeChild(div);
		}, 1000);
		$('#overlay').appendChild(div);
		div.style.left = e.pageX - (Math.random().toFixed(2)*20 + 20) + 'px';
		div.style.top = e.pageY + 'px';
	}
}

let pages = document.getElementsByClassName("page");
let nb = document.getElementsByClassName("nav-button");
function showPage(a) {
	for(let i = 0; i<pages.length; i++)
	{
        pages[i].classList.toggle("show", false);
		if (a != false) {
			$('#' + a + "-page").classList.toggle('show', true);
		}
	}
	if(a == 'inv') {
		rendInv();
	}
	if(a == 'shop') {
		rendShop();
	}
	for(let i = 0; i<nb.length; i++) {
		nb[i].classList.toggle("on", false);
		if (nb[i].id == "nav-" + a) {
			nb[i].classList.toggle("on", true);
		}
 	}

	for(let i = 0; i < popups.length; i++) {
		popups[i].classList.toggle('show', false);
	}
}

function upgrade(a) {
	let u = upgrades[a];
	if(u.cost <= user.cash && u.max > user.upgrades[a]) {
		user.cash -= u.cost;
		u.cost *= u.costscale;
		u.cost = Number(u.cost.toFixed(2));
		user.upgrades[a] ++;
		rendUpgrades();
		rendCash();
	}
}

window.addEventListener('resize', () => {
	if($('#inv-page').className == 'page show') {
		getLastPage();
    	rendInv();
	}
});

function getLastPage() {
	let fit = getItemsPerPage();
	let page = Number($('#inv-page-n').innerHTML);
	let lastPage = Math.ceil(user.inv.length / fit)
	if(lastPage == 0) {lastPage = 1}
	if(page > lastPage) {$('#inv-page-n').innerHTML = lastPage}
}

function getItemsPerPage() {
	let margin = 300;
	if(window.innerWidth < 480) {margin = 50}
	let x = Math.floor((window.innerWidth - margin)/170);
	let y = Math.floor((window.innerHeight - 80)/260);
	if(x*y == 0) {return 1}
	if(y>3) {y = 3}
	return x*y;
}

function getItemData(n) {
	for(let i = 0; i < gitems.length; i ++) {
		if(gitems[i].name = n) {
			return gitems[i];
		}
	}
}

let popups = document.getElementsByClassName("popup");
function showPopup(t, e) {
	let data = e;
	for(let i = 0; i<popups.length; i++) {
		$('#' + popups[i].id).classList.toggle("show", false);
	}
	$("#" + t).classList.toggle("show", true);

	$('#' + t).innerHTML = '';
	let header = document.createElement('div');
	header.className = 'popup-header';

	let backBtn = document.createElement('button');
	backBtn.innerHTML = "<< Back";
	backBtn.className = 'popup-close';
	backBtn.setAttribute('popup', t);
	backBtn.addEventListener('click', function() {
		$('#'+backBtn.getAttribute('popup')).classList.toggle('show', false);
	})
	header.appendChild(backBtn);

	if(t == 'case-info') {
		let items = document.createElement('div');
		items.className = 'info-container';
		let title = document.createElement('div');
		title.className = 'popup-title';
		title.innerHTML = data.name;
		header.appendChild(title);
		let caseContent = gitems.filter(e => e.case == data.case && e.type == 'skin');
		for(let i = 0; i<caseContent.length; i++) {
			let data = getItemData(caseContent[i].name);
			let div = document.createElement('div');
			div.className = "item";

			let inner = document.createElement('div');
			inner.className = "item-inner " + data.class;
			inner.innerHTML = '<img class="inner-image " src="https://raw.githubusercontent.com/waffold/csgo/main/images/' + data.name.replace(" | ", '').replace(' ', '').replace(' ', '') + '.png" alt="skin">';

			let title = document.createElement('div');
			title.className = 'item-title';
			title.innerHTML = data.name;

			inner.appendChild(title);

			div.appendChild(inner);
			items.appendChild(div);
		}
		$('#case-info').appendChild(header);
		$('#case-info').appendChild(items);
	}

	if(t == 'item-info') {
		let info = document.createElement('div');
		let img = document.createElement('img');
		img.className = "info-img";
		img.src = "https://raw.githubusercontent.com/waffold/csgo/main/images/" + data.name.replace(" | ", '').replace(' ', '').replace(' ', '') + ".png";
		img.alt = 'skin';
		info.className = 'info-container item-info';
		info.appendChild(img);

		let title = document.createElement('div');
		title.className = 'popup-title';
		title.innerHTML = e.name;
		header.appendChild(title);

		let raritys = {
			'exceedingly_rare' : 'Exceedingly Rare',
			'covert' : "Covert",
			"restricted" : "Restricted",
			"standard" : "Standard"
		}
		let wears = {
			'FN' : "Factory New",
			'MW' : "Minimal Wear",
			'FT' : "Field Tested",
			'WW' : "Well Worn",
			'BS' : "Battle Scarred",
			'u' : "None"
		}

		let infodata = getItemData(e.name);

		let stats = document.createElement('div');
		let rarity = document.createElement('span');
		rarity.className = 'info-stat';
		rarity.innerHTML = 'Rarity: ' + raritys[infodata.class];
		let st = document.createElement('span');
		st.className = 'info-stat';
		st.innerHTML = 'Stattrak: ' + data.stattrak;
		let price = document.createElement('span');
		price.className = 'info-stat';
		let cost = infodata.price * tToMult[data.t]
		price.innerHTML = 'Price: $' + cost.toFixed(2);
		let wear = document.createElement('span');
		wear.className = 'info-stat';
		wear.innerHTML = "Wear: " + wears[data.t]


		info.appendChild(rarity);
		info.appendChild(st);
		info.appendChild(price);
		info.appendChild(wear);

		$('#item-info').appendChild(header);
		$('#item-info').appendChild(info);
	}
	if(t == 'open-case') {
		let data = getItemData(e.name);

		let title = document.createElement('div');
		title.className = 'popup-title';
		title.innerHTML = data.name;
		header.appendChild(title);
		$('#open-case').appendChild(header);
		let actionBtns = document.createElement('div');
		actionBtns.className = "case-open-btns";
		let openBtn = document.createElement('button');
		openBtn.innerHTML = "Open Case";
		openBtn.style.width = "100px";
		let buyKeyBtn = document.createElement('button');
		console.log(data.case, gitems);
		console.log((gitems.filter(a => a.case == data.case && a.type == 'key')));
		let key = getItemData((gitems.filter(a => a.case == data.case && a.type == 'key'))[0].name);
		buyKeyBtn.innerHTML = "Buy key: $" + key.price;
		buyKeyBtn.style.width = "100px";

		let keyCount = document.createElement('div');
		keyCount.className = 'key-count';
		keyCount.id = 'key-count';
		rendKeyCount(data, keyCount);
		buyKeyBtn.addEventListener('click', function() {
			let key = getItemData((gitems.filter(a => a.case == data.case && a.type == 'key'))[0].name);
			console.log(key, key.price);
			if(user.cash >= key.price) {
				console.log('bought');
				user.inv.push({
					name: key.name,
					stattrak: false,
					t: 'u'
				})
				console.log(key.price, user.inv);
				user.cash -= key.price;
				rendCash();
				rendInv();
				rendKeyCount(data, keyCount);
			}
		})

		actionBtns.appendChild(openBtn);
		actionBtns.appendChild(buyKeyBtn);
		actionBtns.appendChild(keyCount);

		let info = document.createElement('div');
		info.className = 'info-container';
		let caseContent = gitems.filter(e => e.case == data.case && e.type == 'skin');
		for(let i = 0; i<caseContent.length; i++) {
			let item = getItemData(caseContent[i].name);
			let div = document.createElement('div');
			div.className = "item";

			let inner = document.createElement('div');
			inner.className = "item-inner " + item.class;
			inner.innerHTML = '<img class="inner-image " src="https://raw.githubusercontent.com/waffold/csgo/main/images/' + item.name.replace(" | ", '').replace(' ', '').replace(' ', '') + '.png" alt="skin">';

			let title = document.createElement('div');
			title.className = 'item-title';
			title.innerHTML = item.name;

			inner.appendChild(title);

			div.appendChild(inner);
			info.appendChild(div);
		}
		$('#open-case').appendChild(actionBtns);
		info.style["margin-top"] = "40px";
		$('#open-case').appendChild(info);
	}
}

function rendKeyCount(data, k) {
	let keys = 0;
	for(let i = 0; i < user.inv.length; i++) {
		let itemdata = getItemData(user.inv[i].name);
		if(itemdata.type == "key" && itemdata.case == data.case) {
			keys ++;
		}
	}
	//k is the dom element for key count
	k.innerHTML = "Keys: " + keys;

}

function getItemData(n) {
	return gitems.find(a => a.name == n) || false;
}


