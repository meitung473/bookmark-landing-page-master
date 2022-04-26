//---= email vaild =---\\
var email = document.querySelector(".form-email");
email.addEventListener("focus", function (e) {
    if (email.parentNode.classList.contains("invaild")) {
        email.parentNode.classList.remove("invaild");
    }
});
var form = document.querySelector(".form");
form.addEventListener("submit", function (e) {
    e.preventDefault();
    var value = email.value;

    if (!value || !isVaild(value)) {
        email.parentNode.classList.add("invaild");
        return;
    }
});
/**
 * check if is vaild email type
 * @param {String} value for user input email
 * @returns true or false correspone pattern
 */
function isVaild(value) {
    var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (value.match(pattern)) {
        return true;
    }

    return false;
} //---= anchor to section =---\\

var anchors = document.querySelectorAll("[data-anchor]");
var headeroffset = 120;
/**
 * scroll smooth when clicked anchor bring to section
 */

var handler = function handler(e) {
    e.preventDefault();
    var section = e.target.getAttribute("href");
    var offsetTop = document.querySelector(section).offsetTop - headeroffset;
    scroll({
        top: offsetTop,
        behavior: "smooth",
    }); // is header anchor

    if (isHeader(e.target)) {
        var hamburger = document.querySelector("#hamburger");
        hamburger.checked = false;
    }
};
/**
 * check list-item is in header
 * @param {Element} el
 * @returns true for el in header,false for not
 */

function isHeader(el) {
    var headerlist = el.parentNode.parentNode;

    if (headerlist.classList.contains("header__list")) {
        return true;
    }

    return false;
}

anchors.forEach(function (anchor) {
    anchor.addEventListener("click", handler);
}); //---= FAQ controller =---\\

/**
 * FAQ handler，expand detail block
 * @param {Event} e
 * @returns
 */
var changehandler = function changehandler(e) {
    var detail = e.currentTarget.nextElementSibling;

    if (detail.style.maxHeight) {
        detail.style.maxHeight = null;
    } else {
        detail.style.maxHeight = detail.scrollHeight + "px";
    }

    if (!e.target.classList.contains("item__summary")) {
        e.currentTarget.parentNode.classList.toggle("active");
        return;
    }

    e.currentTarget.parentNode.classList.toggle("active");
};

var FAQitem = document.querySelectorAll(".item__summary");
FAQitem.forEach(function (el) {
    el.addEventListener("click", changehandler);
});
