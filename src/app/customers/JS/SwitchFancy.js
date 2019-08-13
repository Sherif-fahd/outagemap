function switchClick(item) {
    var checkBox = item.children[0];

    var target = checkBox;
    var pTarget = item;

    if (checkBox.checked) {
        target.className = target.className.replace("checked", "").trim();
        pTarget.className = pTarget.className.replace("checked", "").trim();
    } else {
        target.className += " checked";
        pTarget.className += " checked";
    }
    checkBox.checked = !checkBox.checked;
}