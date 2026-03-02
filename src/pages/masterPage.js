// 4Simple Modern Design - Global Effects
// Base Colors from Guide: #06B6D4 (Cyan), #8B5CF6 (Violet)

$w.onReady(function () {
    // Navigation Scroll Effect
    // Adjust selector if your header ID is different (e.g., #header1)
    $w("#header1").onViewportLeave(() => {
        $w("#header1").style.backgroundColor = "rgba(7,7,26,0.95)";
    });
    
    $w("#header1").onViewportEnter(() => {
        $w("#header1").style.backgroundColor = "transparent";
    });

    // Primary Button Hover (Cyan Base)
    const primaryBtns = ["#btnDemo", "#btnContact"];
    primaryBtns.forEach(id => {
        $w(id).onMouseIn(() => {
            $w(id).style.backgroundColor = "#0891b2"; // Darker Cyan
        });
        $w(id).onMouseOut(() => {
            $w(id).style.backgroundColor = "#06b6d4";
        });
    });
});
