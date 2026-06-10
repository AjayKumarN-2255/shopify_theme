

  const product = {{ product | json }}; // this picking the current product data from the liquid template and making it available in JS
 
  let selectedOptions = product.options.map(() => null); // initially no options are selected, we will update this as user clicks.
  //  so make an array of nulls with same length as options

  const variantInput = document.querySelector('input[name="id"]');
  // this is the hidden input that Shopify's add to cart form uses to know which variant is being added. We will update its value whenever user selects options.

  // helper: find matching variant
  function findVariant() {
    return product.variants.find(variant =>
      variant.options.every((opt, index) => opt === selectedOptions[index])
    );
  }

  // update UI (price, hidden input, etc.)
  function updateVariant() {
    const variant = findVariant();
    if (!variant) return;

    // update hidden input for add to cart
    if (variantInput) {
      variantInput.value = variant.id;
    }

    // console.log("Selected Variant:", variant);
  }

  // attach click events
  document.querySelectorAll(".variant-group").forEach((group, groupIndex) => {
    const buttons = group.querySelectorAll(".variant-btn");

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const value = btn.innerText.trim();

        // store selected value
        selectedOptions[groupIndex] = value;

        // UI update (selected class)
        buttons.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");

        updateVariant();
      });
    });
  });

  // set default selected values (first available variant)
  if (product.variants.length) {
    selectedOptions = [...product.variants[0].options];

    document.querySelectorAll(".variant-group").forEach((group, i) => {
      const value = selectedOptions[i];
      const btn = [...group.querySelectorAll(".variant-btn")]
        .find(b => b.innerText.trim() === value);

      if (btn) btn.classList.add("selected");
    });

    updateVariant();
  }
