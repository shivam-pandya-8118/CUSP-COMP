// Main JavaScript for Computer Engineering Website

$(document).ready(function () {
  // Initialize all tooltips
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );

  // Initialize all popovers
  const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
  );
  const popoverList = [...popoverTriggerList].map(
    (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
  );

  // Scroll to Top Button
  const scrollTopBtn = $("#scrollTop");

  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      scrollTopBtn.addClass("show").fadeIn();
    } else {
      scrollTopBtn.removeClass("show").fadeOut();
    }
  });

  scrollTopBtn.on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 600);
    return false;
  });

  // Animated Counter
  function animateCounter() {
    $("[data-count]").each(function () {
      const $this = $(this);
      const countTo = $this.attr("data-count");

      $({ countNum: 0 }).animate(
        {
          countNum: countTo,
        },
        {
          duration: 2000,
          easing: "swing",
          step: function () {
            $this.text(Math.floor(this.countNum));
          },
          complete: function () {
            $this.text(this.countNum);
          },
        }
      );
    });
  }

  // Trigger counter animation when element is in viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsSection = document.querySelector(".row.text-center");
  if (statsSection) {
    observer.observe(statsSection);
  }

  // Smooth Scrolling for Anchor Links
  $('a[href^="#"]').on("click", function (e) {
    const target = $(this.getAttribute("href"));
    if (target.length) {
      e.preventDefault();
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: target.offset().top - 70,
          },
          1000
        );
    }
  });

  // Progress Bar Animation on Page Load
  setTimeout(function () {
    $("#loadProgress").fadeOut();
  }, 2000);

  // Toast Notification Function
  function showToast(message) {
    const toastHTML = `
            <div class="toast align-items-center text-white bg-primary border-0 position-fixed bottom-0 end-0 m-3" role="alert" style="z-index: 11">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

    $("body").append(toastHTML);
    const toastElement = $(".toast").last()[0];
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    // Remove toast element after it's hidden
    $(toastElement).on("hidden.bs.toast", function () {
      $(this).remove();
    });
  }

  // Active Navigation Link
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  $(".navbar-nav .nav-link").each(function () {
    const href = $(this).attr("href");
    if (href === currentPage) {
      $(this).addClass("active");
    }
  });

  // Form Validation
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });

  // Lazy Loading Images
  if ("loading" in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js";
    document.body.appendChild(script);
  }

  // Table Search Functionality
  $("#tableSearch").on("keyup", function () {
    const value = $(this).val().toLowerCase();
    $("#dataTable tbody tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  // Entries Per Page Functionality
  $("#entriesPerPage").on("change", function () {
    const entries = $(this).val();
    // Implementation will vary based on your data structure
    console.log(`Show ${entries} entries per page`);
  });

  // Gallery Lightbox
  $(".bento-item").on("click", function () {
    const imgSrc = $(this).find("img").attr("src");
    const caption = $(this).attr("data-caption") || "Gallery Image";

    const modalHTML = `
            <div class="modal fade" id="imageModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${caption}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center">
                            <img src="${imgSrc}" class="img-fluid" alt="${caption}">
                        </div>
                    </div>
                </div>
            </div>
        `;

    $("body").append(modalHTML);
    const modal = new bootstrap.Modal(document.getElementById("imageModal"));
    modal.show();

    $("#imageModal").on("hidden.bs.modal", function () {
      $(this).remove();
    });
  });

  // Auto-hide alerts after 5 seconds
  $(".alert").each(function () {
    const alert = $(this);
    setTimeout(function () {
      alert.fadeOut("slow", function () {
        $(this).remove();
      });
    }, 5000);
  });

  // Copy to Clipboard functionality
  $(".copy-btn").on("click", function () {
    const text = $(this).data("copy");
    navigator.clipboard.writeText(text).then(function () {
      showToast("Copied to clipboard!");
    });
  });

  // Print functionality
  $(".print-btn").on("click", function () {
    window.print();
  });

  // Social Share Buttons
  $(".share-btn").on("click", function (e) {
    e.preventDefault();
    const platform = $(this).data("platform");
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  });

  // Back Button
  $(".back-btn").on("click", function () {
    window.history.back();
  });

  // Confirmation Dialog
  $(".confirm-action").on("click", function (e) {
    if (!confirm("Are you sure you want to proceed?")) {
      e.preventDefault();
    }
  });

  // Dynamic Year in Footer
  $(".current-year").text(new Date().getFullYear());

  // Disable Right Click (Optional - for image protection)
  // $('img').on('contextmenu', function(e) {
  //     e.preventDefault();
  //     showToast('Right click is disabled on images');
  // });

  // Loading Spinner
  function showLoader() {
    const loaderHTML = `
            <div class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
                 style="background: rgba(0,0,0,0.5); z-index: 9999;" id="pageLoader">
                <div class="spinner-border text-light" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
    $("body").append(loaderHTML);
  }

  function hideLoader() {
    $("#pageLoader").fadeOut(function () {
      $(this).remove();
    });
  }

  // AJAX Form Submission Example
  $(".ajax-form").on("submit", function (e) {
    e.preventDefault();
    showLoader();

    const formData = $(this).serialize();

    $.ajax({
      url: $(this).attr("action"),
      method: "POST",
      data: formData,
      success: function (response) {
        hideLoader();
        showToast("Form submitted successfully!");
      },
      error: function () {
        hideLoader();
        showToast("Error submitting form. Please try again.");
      },
    });
  });

  // Read More / Read Less Toggle
  $(".read-more-btn").on("click", function () {
    const target = $($(this).data("target"));
    const btn = $(this);

    target.slideToggle();

    if (btn.text() === "Read More") {
      btn.text("Read Less");
    } else {
      btn.text("Read More");
    }
  });

  // FAQ Accordion Toggle Icon
  $(".accordion-button").on("click", function () {
    const icon = $(this).find("i.fa-chevron-down, i.fa-chevron-up");
    if ($(this).hasClass("collapsed")) {
      icon.removeClass("fa-chevron-up").addClass("fa-chevron-down");
    } else {
      icon.removeClass("fa-chevron-down").addClass("fa-chevron-up");
    }
  });

  // Initialize AOS (Animate On Scroll) if library is included
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }

  // Console Welcome Message
  console.log(
    "%cWelcome to C. U. Shah Govt. Polytechnic, Diploma in Computer Engineering Department Website! ",
    "background: #0d6efd; color: white; font-size: 30px; padding: 10px;"
  );
console.log(`
____           ____  _     _                         ____                 _
 __ ) _   _   / ___|| |__ (_)_   ____ _ _ __ ___    |  _ \\ __ _ _ __   __| |_   _  __ _
  _ \\| | | |  \\___ \\| '_ \\| \\ \\ / / _\` | '_ \` _ \\   | |_) / _\` | '_ \\ / _\` | | | |/ _\` |
 |_) | |_| |   ___) | | | | |\\ V / (_| | | | | | |  |  __/ (_| | | | | (_| | |_| | (_| |
____/ \\__, |  |____/|_| |_|_| \\_/ \\__,_|_| |_| |_|  |_|   \\__,_|_| |_|\\__,_|\\__, |\\__,_|
      |___/                                                                |___/
`);
  console.log(
    "%c Last updated on 08 November 2025 ",
    "background: #871919ff; color: white; font-size: 15px; padding: 5px;"
  );
});

// Service Worker Registration (for PWA)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // navigator.serviceWorker.register('/sw.js')
    //     .then(registration => console.log('SW registered'))
    //     .catch(err => console.log('SW registration failed'));
  });
}

