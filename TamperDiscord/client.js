const uiseparator = document.createElement("div");
uiseparator.className = "separator-gCa7yv";
const Core = (function(modules)
{
	fs.readFile(`C:\\Users\\jackg\\AppData\\Roaming\\tamperdiscord\\test\\test.txt`, 'utf8', function(e, c) { alert(c); });
	document.getElementsByClassName("button-14-BFJ enabled-2cQ-u7 button-38aScr lookBlank-3eh9lL colorBrand-3pXr91 grow-q77ONN")[2].addEventListener("click", function(){
		setTimeout(function()
		{
			var exitbtn = document.createElement("div");
			exitbtn.className ='item-PXvHYJ themed-OHr7kt';
			exitbtn.setAttribute('role', 'button');
			exitbtn.innerText = "Reload Discord";
			exitbtn.addEventListener("click",function(){window.location.reload();});
			document.getElementsByClassName("side-8zPYf6")[0].insertBefore( exitbtn , document.getElementsByClassName("item-PXvHYJ")[26] );
		}, 111);
	});

})