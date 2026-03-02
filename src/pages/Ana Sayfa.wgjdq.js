// 4Simple Home Page - Visual Effects
// Selectors match the "Wix Application Guide" section structure

$w.onReady(function () {
    // 1. Hero Content Fade-In
    $w("#heroTitle").show("fade", { duration: 800, delay: 200 });
    $w("#heroDesc").show("fade", { duration: 800, delay: 400 });

    // 2. Service Cards Hover Effect
    // IDs should be #serviceCard1, #serviceCard2, etc. in Wix Editor
    for (let i = 1; i <= 6; i++) {
        const cardId = `#serviceCard${i}`;
        $w(cardId).onMouseIn(() => {
            $w(cardId).style.borderColor = "rgba(6,182,212,0.4)"; // Bright Cyan Border
            $w(cardId).style.backgroundColor = "#111130"; // Slightly lighter dark
        });
        $w(cardId).onMouseOut(() => {
            $w(cardId).style.borderColor = "rgba(6,182,212,0.08)";
            $w(cardId).style.backgroundColor = "#0d0d22";
        });
    }

    // 3. Product Cards Hover
    const productCards = ["#stockMateCard", "#webPlusCard", "#questMateCard", "#trassirCard"];
    productCards.forEach(id => {
        $w(id).onMouseIn(() => {
            // Wix doesn't support 'transform: translateY' in Velo easily
            // We use shadow/border for feedback
            $w(id).shadow = {
                "color": "rgba(6,182,212,0.2)",
                "blur": 30,
                "x": 0,
                "y": 10
            };
        });
        $w(id).onMouseOut(() => {
            $w(id).shadow = { "color": "transparent" };
        });
    });
});
