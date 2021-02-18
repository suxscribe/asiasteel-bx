$(document).ready(function () {
  if ($('.articles').length) {
    var ARTICLES_PAGES = [$('.articles__section')],
      ARTICLES_INNER_ELEMENT = $('.articles__inner'),
      ARTICLES_PAGES_COUNT = ARTICLES_INNER_ELEMENT.data('pages'),
      ARTICLES_URL = ARTICLES_INNER_ELEMENT.data('url'),
      screenHeight = $(window).height();

    if (ARTICLES_PAGES_COUNT > 1) {
      if (
        ARTICLES_PAGES_COUNT !==
        ARTICLES_PAGES[ARTICLES_PAGES.length - 1].data('page')
      ) {
        var isCanLoad = true;
      }

      function loadArticles(scrollOffsetTop) {
        var CURRENT_ARTICLE_PAGE = ARTICLES_PAGES[ARTICLES_PAGES.length - 1],
          offsetToBottomLastPage =
            CURRENT_ARTICLE_PAGE.offset().top +
            CURRENT_ARTICLE_PAGE.outerHeight();

        /*Условия срабатывания загрузки следующей страницы*/
        if (
          scrollOffsetTop + screenHeight > offsetToBottomLastPage &&
          isCanLoad
        ) {
          isCanLoad = false;

          var curCountPage = parseInt(CURRENT_ARTICLE_PAGE.data('page')),
            url = ARTICLES_URL + '?PAGEN_1=' + (curCountPage + 1);

          $.get(url, function (data) {
            var newPage = $(data).find('.articles__section');
            var newPagination = $(data).find('.pagination');

            newPage.appendTo(ARTICLES_INNER_ELEMENT);

            $('.pagination').html(newPagination.html());

            window.history.replaceState(
              {},
              '',
              ARTICLES_URL + 'page_' + (curCountPage + 1)
            );

            ARTICLES_PAGES.push(newPage);

            if (ARTICLES_PAGES_COUNT !== newPage.data('page')) {
              isCanLoad = true;
            }
          });
        }
      }
    }

    function initMoveToolbars() {
      var right = $('.articles__right'),
        rightOffsetTop = right.offset().top,
        header = $('header'),
        headerOuterHeight = header.outerHeight(),
        addOffset = 80;

      return function move(scrollOffsetTop) {
        var screenOffsetTop = scrollOffsetTop + headerOuterHeight + addOffset;

        if (screenOffsetTop >= rightOffsetTop) {
          right.removeAttr('style');
          right.css({
            top: screenOffsetTop - right.offset().top + addOffset + 'px',
          });
        } else {
          right.removeAttr('style');
        }
      };
    }

    var moveToolbars = initMoveToolbars();

    $(window).scroll(function () {
      if (ARTICLES_PAGES_COUNT > 1) {
        loadArticles($(window).scrollTop());
      }

      moveToolbars($(window).scrollTop());
    });
  }
});
function changeBasket(elem) {
  if ($('.basket').length) {
    var topParent = elem.closest('.basket__item'),
      firstParent = elem.closest('.basket__cell'),
      id = topParent.data('id'),
      groupType = topParent.data('group'),
      measure = topParent.data('measure'),
      count = firstParent.find('.counter__field').val();

    if (firstParent.data('fieldwidth')) {
      $.post(
        '/basket/changeBasket.php',
        {
          id: id,
          groupType: groupType,
          count: count,
          width: firstParent.data('fieldwidth'),
        },
        function () {}
      ).fail(function () {
        alert('error');
      });
    } else {
      $.post(
        '/basket/changeBasket.php',
        { id: id, groupType: groupType, count: count, measure: measure },
        function () {}
      ).fail(function () {
        alert('error');
      });

      var basketInfo = $('.basketHeaderInfo');

      $.post('/basket/', function (data) {
        //меняем итоги тотла в шапке корзины
        basketInfo.html($(data).find('.basketHeaderInfo').html());
      }).fail(function () {
        alert('error');
      });
    }
  }
}

$(document).ready(function () {
  if ($('.basket').length) {
    $(document).off('click', '.basket__clearAll');
    $(document).on('click', '.basket__clearAll', function () {
      var url = '/basket/remove2basket.php',
        items = $('.basket__main .basket__wrapper'),
        counter = $('.basketSmallBtn__counter');

      $.post(url, { removeAll: 'removeAll' }, function () {
        items.empty().remove();
        counter.empty().remove();
      }).fail(function () {
        alert('error');
      });

      var basketMain = $('main');

      $.post('/basket/', function (data) {
        if ($(data).find('main').length) {
          basketMain.fadeOut(250, function () {
            basketMain.html($(data).find('main').html());

            basketMain.fadeIn(250);
          });
        }
      }).fail(function () {
        alert('error');
      });
    });

    $(document).off('click', '.basket__removeItem');
    $(document).on('click', '.basket__removeItem', function () {
      var url = '/basket/remove2basket.php',
        id = $(this).data('id'),
        groupType = $(this).data('grouptype'),
        measure = $(this).data('measure'),
        parent = $(this).closest('.basket__item');

      if (id) {
        $.post(
          url,
          { id: id, groupType: groupType, measure: measure },
          function (data) {
            parent.empty().remove();
            $('.basketSmallBtn__text').html($(data));
          }
        ).fail(function () {
          alert('error');
        });

        var basketInfo = $('.basketHeaderInfo');

        $.post('/basket/', function (data) {
          if ($(data).find('.basketHeaderInfo').length) {
            basketInfo.html($(data).find('.basketHeaderInfo').html());
          } else {
            $('main').fadeOut(250, function () {
              $('main').html($(data).find('main').html());

              $('main').fadeIn(250);
            });
          }
        }).fail(function () {
          alert('error');
        });
      }
    });

    $(document).off('input', '.basket__change');
    $(document).on('input', '.basket__change', function () {
      changeBasket($(this));
    });

    $(document).on('click', '.basket__order', function () {
      var id = $(this).attr('href'),
        header = $('.header'),
        headerHeight = header.outerHeight(),
        addOffsetTop = 0;

      if (window.innerWidth < 1680) {
        addOffsetTop = 50;
      } else {
        addOffsetTop = 80;
      }

      var top = $(id).offset().top - headerHeight - addOffsetTop;

      $('body,html').animate({ scrollTop: top }, 500);
    });
  }
});

$(document).ready(function () {
  function btnEnterHover(elem, event) {
    var parentOffset = elem.offset(),
      relX = event.pageX - parentOffset.left,
      relY = event.pageY - parentOffset.top;

    elem.find('div:first-child').css({
      top: relY,
      left: relX,
      width: elem.outerWidth() * 2 + 'px',
      height: elem.outerWidth() * 2 + 'px',
    });
  }
  function btnLeaveHover(elem, event) {
    var parentOffset = elem.offset(),
      relX = event.pageX - parentOffset.left,
      relY = event.pageY - parentOffset.top;

    elem
      .find('div:first-child')
      .css({ top: relY, left: relX, width: 0, height: 0 });
  }

  $(document)
    .on('mouseover', '.button_style1', function (e) {
      btnEnterHover($(this), e);
    })
    .on('mouseout', '.button_style1', function (e) {
      btnLeaveHover($(this), e);
    });

  $(document)
    .on('mouseover', '.button_style2', function (e) {
      btnEnterHover($(this), e);
    })
    .on('mouseout', '.button_style2', function (e) {
      btnLeaveHover($(this), e);
    });

  $(document)
    .on('mouseover', '.button_style5', function (e) {
      btnEnterHover($(this), e);
    })
    .on('mouseout', '.button_style5', function (e) {
      btnLeaveHover($(this), e);
    });
});
$(document).ready(function () {
  $(document).on('click', '.cardOfContact__mail a', function () {
    //Yandex.Metrika
    ym(46768650, 'reachGoal', 'click_mail_kontakt');

    return true;
  });
});
$(document).ready(function () {
  if ($('.catalogFilter').length) {
    $(document).off('click', '.catalogFilter__more');
    $(document).on('click', '.catalogFilter__more', function () {
      var parent = $(this).closest('.bx-filter-block'),
        conteiner = parent.find('.catalogFilter__conteiner'),
        itemHeight = $('.catalogFilter__wrapperCheckbox').outerHeight(true),
        countRow = $(this).data('countrow'),
        countItem = $(this).data('countitem');

      if ($(this).hasClass('jQ_active')) {
        $(this).removeClass('jQ_active');
        parent.removeAttr('style');
        conteiner.css({ 'max-height': '' });
        $(this).text('Показать еще ' + (countItem - 8));
      } else {
        $(this).addClass('jQ_active');
        parent.removeAttr('style');
        conteiner.css({ 'max-height': '' + itemHeight * countRow + 'px' });
        $(this).text('Скрыть');
      }
    });
  }
});

function ajaxReloadContetn(url) {
  // ф-ия вызывается в компаненте catalog.smart.filter шаблоне filter_to_cataloga

  var blockDetail = $('.detail'),
    blockSections = blockDetail.find('.detail__sections');

  CATALOG_PAGE_COUNTER = 1; //Эта переменная обьявлена в модуле detail, и обнуляется при переключении таба или величивается при нажатии на показать ещё

  history.pushState(null, null, url);

  $.post(url, function (data) {
    blockSections.stop().fadeOut(250, function () {
      blockSections.html($(data).find('.detail__section'));
      blockSections.stop().fadeIn(250);
    });
  }).fail(function () {
    alert('error');
  });
}

$(document).ready(function () {
  if ($('.stamp-comparison').length) {
    var dataElements = $('.charts__props li'),
      charts = $('.charts__chart'),
      chartElements = $('.charts__chart li'),
      infoPercent = $('.charts__infoPercent');

    $(document)
      .on('mouseenter', '.charts__prop', function () {
        var curIndex = $(this).index();

        $.each(dataElements, function (i, elem) {
          if (i !== curIndex) {
            $(elem).addClass('hide');
          } else {
            $(elem).removeClass('hide');
          }
        });
        $.each(chartElements, function (i, elem) {
          $(elem).addClass('hide');
        });
        $.each(charts, function (i, elem) {
          var curChartElem = $(elem)
              .children('li')
              .eq(curIndex + 1),
            dataPercent = curChartElem.data('percent'),
            infoBlock = $(elem).children('.charts__infoPercent');

          infoBlock.text(dataPercent + '%');

          curChartElem.removeClass('hide');
        });
      })
      .on('mouseleave', '.charts__prop', function () {
        $.each(dataElements, function (i, elem) {
          $(elem).removeClass('hide');
        });
        $.each(chartElements, function (i, elem) {
          $(elem).removeClass('hide');
        });
        $.each(infoPercent, function (i, elem) {
          $(elem).text('');
        });
      })
      .on('mouseenter', '.charts__chart li', function () {
        var curIndex = $(this).index();

        $.each(dataElements, function (i, elem) {
          if (i !== curIndex - 1) {
            $(elem).addClass('hide');
          } else {
            $(elem).removeClass('hide');
          }
        });
        $.each(chartElements, function (i, elem) {
          $(elem).addClass('hide');
        });
        $.each(charts, function (i, elem) {
          var dataPercent = $(elem).children('li').eq(curIndex).data('percent'),
            infoBlock = $(elem).children('.charts__infoPercent');

          infoBlock.text(dataPercent + '%');

          $(elem).children('li').eq(curIndex).removeClass('hide');
        });
      })
      .on('mouseleave', '.charts__chart li', function () {
        $.each(dataElements, function (i, elem) {
          $(elem).removeClass('hide');
        });
        $.each(chartElements, function (i, elem) {
          $(elem).removeClass('hide');
        });
        $.each(infoPercent, function (i, elem) {
          $(elem).text('');
        });
      });
  }
});
$(document).ready(function () {
  if ($('.counter').length) {
    function countPlus(elem) {
      var counter = $(elem).closest('.counter'),
        input = counter.find('input');

      if (+input.val() < 999) {
        var count = +input.val() + 1;

        count = count < 999 ? count : 999;
      } else {
        count = 999;
      }

      input.val(Math.round(count * 100) / 100);

      setInfoToCounterClone(elem);

      disableCountButton(elem);
    }

    function countMinus(elem) {
      var counter = $(elem).closest('.counter'),
        input = counter.find('input');

      if (+input.val() > 1) {
        var count = +input.val() - 1;

        count = count > 1 ? count : 1;
      } else {
        count = 1;
      }

      input.val(Math.round(count * 100) / 100);

      setInfoToCounterClone(elem);

      disableCountButton(elem);
    }

    var BEFORE_INPUT_COUNTER_VALUE = 1;

    function disableCountButton(elem) {
      var counter = elem.closest('.counter'),
        plus = counter.find('.counter__plus'),
        minus = counter.find('.counter__minus'),
        input = counter.find('.counter__field');

      if (input.val() <= 1) {
        minus.addClass('counter__disable');
      } else {
        minus.removeClass('counter__disable');
      }

      if (input.val() >= 999) {
        plus.addClass('counter__disable');
      } else {
        plus.removeClass('counter__disable');
      }
    }

    function focusToCounterInput(elem) {
      BEFORE_INPUT_COUNTER_VALUE = elem.val();
    }

    function setInfoToCounterClone(elem) {
      var counter = elem.closest('.counter'),
        cloneInput = counter.find('.counter__cloneInput'),
        cloneDimension = counter.find('.counter__cloneDimension'),
        input = counter.find('.counter__field'),
        radio = counter.find('.counter__btn:checked'),
        dataText = radio.data('textforclonevalue');

      if (input.val() > 1) {
        cloneInput.text(input.val());
        cloneDimension.text(dataText);
      } else {
        cloneInput.text('');
        cloneDimension.text('');
      }
    }

    function checkCounterChange(elem) {
      var test = /[^\d.,]/gi.test(elem.val()),
        symbol = /[.,]/gi.test(elem.val());

      var value = test ? BEFORE_INPUT_COUNTER_VALUE : elem.val(); //this value have type string
      value = value.replace(',', '.');

      if (symbol) {
        var onlyOneSymbol = value.match(/[.,]/gi).length <= 1;

        if (onlyOneSymbol) {
          BEFORE_INPUT_COUNTER_VALUE = value;
          elem.val(value);
          setInfoToCounterClone(elem);

          disableCountButton(elem);
        } else {
          elem.val(BEFORE_INPUT_COUNTER_VALUE);
          setInfoToCounterClone(elem);

          disableCountButton(elem);
        }
      } else {
        BEFORE_INPUT_COUNTER_VALUE = value;
        elem.val(value);
        setInfoToCounterClone(elem);

        disableCountButton(elem);
      }
    }

    $(document)
      .on('click', '.counter__plus', function () {
        countPlus($(this));
        DisabledButtonAdd2Basket();
        changeBasket($(this)); //ф-ия объявленна в компоненте корзины
      })
      .on('click', '.counter__minus', function () {
        countMinus($(this));
        DisabledButtonAdd2Basket();
        changeBasket($(this)); //ф-ия объявленна в компоненте корзины
      })
      .on('focus', '.counter__field', function () {
        focusToCounterInput($(this));
        DisabledButtonAdd2Basket();
      })
      .on('input', '.counter__field', function () {
        checkCounterChange($(this));
        DisabledButtonAdd2Basket();
      })
      .on('change', '.counter__btn', function () {
        setInfoToCounterClone($(this));
        DisabledButtonAdd2Basket();
      })
      .on('keyup', '.counter__field', function (event) {
        switch (event.keyCode) {
          case 38:
          case 107:
          case 187:
            event.preventDefault();
            focusToCounterInput($(this));
            countPlus($(this));
            checkCounterChange($(this));
            break;
          case 40:
          case 109:
          case 189:
            event.preventDefault();
            focusToCounterInput($(this));
            countMinus($(this));
            checkCounterChange($(this));
            break;
        }
      });
  }
});
var CATALOG_PAGE_COUNTER = 1;

$(document).ready(function () {
  if ($('.detail').length) {
    $(document).off('click', '.detail__tab');
    $(document).on('click', '.detail__tab', function () {
      CATALOG_PAGE_COUNTER = 1;

      var url = $(this).data('url'),
        bgImage = $(this).data('bgimageurl'),
        blockDetail = $('.detail'),
        blockTabs = blockDetail.find('.detail__tabs'),
        blockMain = blockDetail.find('.detail__main'),
        blockSection = blockDetail.find('.detail__section'),
        blockFilter = blockDetail.find('.detail__filter');

      history.pushState(null, null, url);

      $.post(url, function (data) {
        blockTabs.html($(data).find('.detail__tabs'));
        blockMain.stop().fadeOut(250, function () {
          blockSection.html($(data).find('.detail__section'));
          blockFilter.html($(data).find('.catalogFilter'));
          blockMain.stop().fadeIn(250);
          $('.mainBg').css({ background: bgImage });
        });
      }).fail(function () {
        alert('error');
      });
    });
    window.onpopstate = function () {
      history.go();
    };
  }
});
function feedbackFormFieldFocus(elem) {
  if (!elem.hasClass('jQ_input_not_empty')) {
    elem.addClass('jQ_input_not_empty');
  }
}

function feedbackFormFieldBlur(elem) {
  if (!elem.val()) {
    elem.removeClass('jQ_input_not_empty');
  }
}

function addErrorMessageToForm(parentElement, fieldToForm, text) {
  if (
    !fieldToForm.classList.contains('feedbackFields_error') &&
    !fieldToForm.classList.contains('feedback-form__field_warning')
  ) {
    fieldToForm.classList.remove('feedbackFields_successful');
    fieldToForm.classList.add('feedbackFields_error');
  }
  var newWarning = document.createElement('div');
  newWarning.classList.add('feedbackFields__warning-message');
  newWarning.classList.add('checkingOnClientSide');
  newWarning.innerHTML = text;

  for (var i = 0; i < parentElement.children.length; i++) {
    if (
      parentElement.children[i].classList.contains(
        'feedbackFields__warning-message'
      )
    ) {
      parentElement.replaceChild(newWarning, parentElement.children[i]);
    } else {
      parentElement.appendChild(newWarning);
    }
  }
}

$(document).ready(function () {
  $(document).on('focus', '.feedbackFields input', function () {
    feedbackFormFieldFocus($(this));
  });
  $(document).on('blur', '.feedbackFields input', function () {
    feedbackFormFieldBlur($(this));
  });
  $(document).on('focus', '.feedbackFields textarea', function () {
    feedbackFormFieldFocus($(this));
  });
  $(document).on('blur', '.feedbackFields textarea', function () {
    feedbackFormFieldBlur($(this));
  });

  $(document).off('blur', "input[type='tel']"); //Валидация поля PHONE
  $(document).on('blur', "input[type='tel']", function () {
    var parentElement = this.parentElement;

    if (this.value) {
      var inputPhoneValid = /\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}/.test(
        this.value
      );
      if (inputPhoneValid) {
        parentElement.classList.remove('feedbackFields_error');
        parentElement.classList.add('feedbackFields_successful');
        for (var i = 0; i < parentElement.children.length; i++) {
          if (
            parentElement.children[i].classList.contains(
              'feedbackFields__warning-message'
            )
          ) {
            parentElement.removeChild(parentElement.children[i]);
          }
        }
      } else {
        addErrorMessageToForm(
          parentElement,
          parentElement,
          'Это поле заполнено неверно'
        );
      }
    } else {
      addErrorMessageToForm(
        parentElement,
        parentElement,
        'Это поле нужно заполнить'
      );
    }
  });

  $(document).off('blur', "input[type='email']"); //Валидация поля MAIL
  $(document).on('blur', "input[type='email']", function () {
    var parentElement = this.parentElement;

    if (this.value) {
      var inputMailValid = /^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(?:\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@(?:[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\.)*(?:aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|rocks|tel|travel|[a-z][a-z])$/.test(
        this.value
      );

      if (inputMailValid) {
        parentElement.classList.remove('feedbackFields_error');
        parentElement.classList.add('feedbackFields_successful');
        for (var i = 0; i < parentElement.children.length; i++) {
          if (
            parentElement.children[i].classList.contains(
              'feedbackFields__warning-message'
            )
          ) {
            parentElement.removeChild(parentElement.children[i]);
          }
        }
      } else {
        addErrorMessageToForm(
          parentElement,
          parentElement,
          'Это поле заполнено неверно'
        );
      }
    } else {
      addErrorMessageToForm(
        parentElement,
        parentElement,
        'Это поле нужно заполнить'
      );
    }
  });
});
$(document).ready(function () {
  var feedbackForm = $('.feedbackForm');

  $(document).on('click', '.feedbackForm__open', function () {
    feedbackForm.stop().fadeIn(500, function () {
      $(this).removeClass('feedbackForm_animate');
    });
  });

  $(document).on('click', '.feedbackForm__close', function () {
    feedbackForm
      .stop()
      .fadeOut(500, function () {
        $(this).addClass('feedbackForm_animate');
      })
      .removeClass('success');
  });
});

$(document).ready(function () {
  if ($('.feedbackPriceInquiry').length) {
    $(document).on('click', '.feedbackPriceInquiry__close', function () {
      var popup = $('.screen6__feedback'),
        form = $('.feedbackPriceInquiry');

      popup.fadeOut(500, function () {
        form.addClass('feedbackPriceInquiry_animate');
      });
    });
  }
});
function initScriptToSelectOrderBtn() {
  //ф-ия вызывается в компоненте productSelection
  $(document)
    .on('click', '.feedbackOrder__orderList', function () {
      var id = '',
        url = '/basket/add2basket.php',
        type = $('.selectField[data-type]').data('type'),
        mark = $('.selectField[data-name]').data('name'),
        surface = $('.selectField[data-surface]').data('surface'),
        thickness = $('.selectField[data-thickness]').data('thickness'),
        width = $('.selectField[data-width]').data('width'),
        length = $('.selectField[data-length]').data('length'),
        count = $('.selectField .counter__field').val(),
        totalStr = type + mark + surface + thickness + width + length;

      function add2basket() {
        if (count > 0) {
          $.post(
            url,
            {
              id: id,
              group: 'Нержавеющая сталь',
              type: type,
              mark: mark,
              surface: surface,
              thickness: thickness,
              width: width,
              length: length,
              count: count,
              icon: true,
            },
            function (data) {
              if ($('.basketSmallBtn__counter').length) {
                $('.basketSmallBtn__counter').html(
                  $(data).find('.basketSmallBtn__text')
                );
              } else {
                $('.basketSmallBtn').append(
                  $(data).find('.basketSmallBtn__counter')
                );
              }

              $('.header__right').prepend($(data).find('.basketPopup'));

              $('.basketPopup').animate({ opacity: 1 }, 300);

              setTimeout(function () {
                $('.basketPopup').fadeOut(300, function () {
                  $(this).empty().remove();
                });
              }, 3300);
            }
          ).fail(function () {
            alert('error');
          });
        }
      }

      /*получаем hash(id) товара, затем добавляем в корзину*/
      $.post('/ajax/createHash.php', { totalStr: totalStr }, function (data) {
        id = data;

        add2basket();
      }).fail(function () {
        alert('error');
      });

      //Yandex.Metrika
      ym(46768650, 'reachGoal', 'bask_up');
    })
    .on('click', '.feedbackOrder__orderTruby', function () {
      var patent = $(this).closest('.feedbackOrder'),
        url = '/basket/add2basket.php',
        id = '',
        type = $('.selectField[data-type]').data('type'),
        view = $('.selectField[data-view]').data('view'),
        surface = $('.selectField[data-surface]').data('surface'),
        thickness = $('.selectField[data-thickness]').data('thickness'),
        width = $('.selectField[data-width]').data('width'),
        length = $('.selectField[data-length]').data('length'),
        height = $('.selectField[data-height]').data('height'),
        measure = patent.find('.counter__btn:checked + label').data('measure'),
        count = $('.selectField .counter__field').val(),
        totalStr = type + view + surface + thickness + width + length + measure;

      function add2basket() {
        if (count > 0) {
          $.post(
            url,
            {
              id: id,
              group: 'Трубы',
              type: type,
              view: view,
              surface: surface,
              thickness: thickness,
              width: width,
              length: length,
              height: height,
              count: count,
              measure: measure,
              icon: true,
            },
            function (data) {
              if ($('.basketSmallBtn__counter').length) {
                $('.basketSmallBtn__counter').html(
                  $(data).find('.basketSmallBtn__text')
                );
              } else {
                $('.basketSmallBtn').append(
                  $(data).find('.basketSmallBtn__counter')
                );
              }

              $('.header__left').prepend($(data).find('.basketPopup'));
              setTimeout(function () {
                $('.basketPopup').empty().remove();
              }, 3000);
            }
          ).fail(function () {
            alert('error');
          });
        }
      }

      $.post('/ajax/createHash.php', { totalStr: totalStr }, function (data) {
        id = data;

        add2basket();
      }).fail(function () {
        alert('error');
      });

      //Yandex.Metrika
      ym(46768650, 'reachGoal', 'bask_up');
    })
    .on('click', '.feedbackOrder__close', function () {
      closeFeedbackOrder();
    })
    .on('click', '.feedbackOrder__background', function () {
      closeFeedbackOrder();
    })
    .on('keyup', function (event) {
      switch (event.keyCode) {
        case 27: {
          closeFeedbackOrder();
        }
      }
    });

  $('.button_style2')
    .on('mouseover', function (event) {
      var parentOffset = $(this).offset(),
        relX = event.pageX - parentOffset.left,
        relY = event.pageY - parentOffset.top;

      $(this)
        .find('div:first-child')
        .css({
          top: relY,
          left: relX,
          width: $(this).outerWidth() * 2 + 'px',
          height: $(this).outerWidth() * 2 + 'px',
        });
    })
    .on('mouseout', function (event) {
      var parentOffset = $(this).offset(),
        relX = event.pageX - parentOffset.left,
        relY = event.pageY - parentOffset.top;

      $(this)
        .find('div:first-child')
        .css({ top: relY, left: relX, width: 0, height: 0 });
    });

  function closeFeedbackOrder() {
    var productSelection = $('.productSelection'),
      feedbackOrder = $('.feedbackOrder');

    feedbackOrder.stop().fadeOut(250);

    setTimeout(function () {
      productSelection.removeAttr('style');
    }, 250);
  }
}
$(document).ready(function () {
  if ($('.firstScreen').length) {
    var firstScreenImg = $('.firstScreen__img'),
      firstScreenImgUrl = firstScreenImg
        .css('background-image')
        .slice(4, -1)
        .replace(/"/g, '');

    var downloadingImage = new Image();

    downloadingImage.src = firstScreenImgUrl;

    function firstScreenAnimation() {
      var mainBg = $('.mainBg_first'),
        img = $('.firstScreen__img'),
        title = $('.firstScreen__title'),
        gradient = $('.firstScreen__gradient');

      return function move(scrollOffsetTop) {
        img.css({
          transform: 'translate3D(0,' + scrollOffsetTop * 0.2 + 'px, 0)',
        });
        title.css({
          transform: 'translate3D(0,' + scrollOffsetTop * 0.3 + 'px, 0)',
        });
        mainBg.css({
          transform: 'translate3D(0,' + scrollOffsetTop * 0.4 + 'px, 0)',
        });
        gradient.css({
          transform: 'translate3D(0,' + scrollOffsetTop * -0.2 + 'px, 0)',
        });
      };
    }

    function hideIconScrollPointer(scrollOffsetTop) {
      var item = $('.scrollPointer');
      if (scrollOffsetTop > 0) {
        item.fadeOut(250);
      } else {
        item.fadeIn(250);
      }
    }

    downloadingImage.onload = function () {
      var firstScreenMove = firstScreenAnimation(),
        bg = $('.mainBg_first');

      $(window).scroll(function () {
        var scrollOffsetTop = $(window).scrollTop();

        firstScreenMove(scrollOffsetTop);
        hideIconScrollPointer(scrollOffsetTop);
      });

      firstScreenMove($(window).scrollTop());
      hideIconScrollPointer($(window).scrollTop());

      bg.css('opacity', 1);

      firstScreenImg.css({ transform: 'translate3D(0,0,0)', opacity: 1 });

      setTimeout(function () {
        firstScreenImg.removeClass('animate');
      }, 800);

      $(window).resize(function () {
        firstScreenMove($(window).scrollTop());
        hideIconScrollPointer($(window).scrollTop());
      });
    };
  }
});
$(window).on('load', function () {
  if ($('.firstScreenAnimate').length) {
    $('.firstScreenAnimate').removeClass('firstScreenAnimate');
  }
});
$(document).ready(function () {
  DisabledButtonAdd2Basket();

  $(document).off('click', '.counter__field');
  $(document).on('change', '.counter__field', function () {
    var value = Number($(this).val());
    if (value <= 0) {
      $(this)
        .parents('.listDetail__row')
        .find('.listDetail__button')
        .addClass('disabled');
    } else {
      $(this)
        .parents('.listDetail__row')
        .find('.listDetail__button')
        .removeClass('disabled');
    }
  });

  $(document).off('click', '.counter__field');
  $(document).on('keyup', '.counter__field', function () {
    var value = Number($(this).val());
    if (value <= 0) {
      $(this)
        .parents('.listDetail__row')
        .find('.listDetail__button')
        .addClass('disabled');
    } else {
      $(this)
        .parents('.listDetail__row')
        .find('.listDetail__button')
        .removeClass('disabled');
    }
  });

  if ($('.listDetail').length) {
    $(document).off('click', '.listDetail__more');
    $(document).on('click', '.listDetail__more', function () {
      CATALOG_PAGE_COUNTER++; //Эта переменная обьявлена в модуле detail, и обнуляется при переключении таба или фильтра

      var url = $(this).data('url'),
        tableWrapper = $('.listDetail__wrapper'),
        btnMore = $('.listDetail__more');

      if (/PAGEN_\d=\d/.test(url)) {
        url = url.replace(/PAGEN_\d=\d/, 'PAGEN_1=' + CATALOG_PAGE_COUNTER);
      } else {
        url = url + '&PAGEN_1=' + CATALOG_PAGE_COUNTER;
      }

      history.pushState(null, null, url);

      $.post(url, function (data) {
        tableWrapper.append($(data).find('.listDetail__row'));
        btnMore.html($(data).find('.showMore'));
      }).fail(function () {
        alert('error');
      });
    });

    $(document).off('click', '.listDetail__title');
    $(document).on('click', '.listDetail__title', function () {
      CATALOG_PAGE_COUNTER = 1; //Эта переменная обьявлена в модуле detail

      var innerItem = $(this).find('span'),
        url = innerItem.data('url'),
        sortProperty = innerItem.data('sortpropery'),
        sortOrder = innerItem.data('sortorder'),
        listWrapper = $('.listDetail'),
        index = $(this).index(),
        isActive = $(this).hasClass('active'),
        isArrowActive = $('.listDetail__title.active')
          .find('.listDetail__icon')
          .hasClass('active');

      if (isActive) {
        //если активный значит нажали повторно и нужно сменить сортировку
        sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
      }

      history.replaceState('', '', url); //меняем url и запись в истории

      $.post(
        url,
        { sortProperty: sortProperty, sortOrder: sortOrder },
        function (data) {
          listWrapper.html($(data).find('.listDetail').html());

          $('.listDetail__title.active').removeClass('active');

          $('.listDetail__title').eq(index).addClass('active');

          var arrow = $('.listDetail__title')
            .eq(index)
            .find('.listDetail__icon');

          if (isActive) {
            if (isArrowActive) {
              arrow.removeClass('active');
            } else {
              arrow.addClass('active');
            }
          } else {
            if (isArrowActive) {
              arrow.addClass('active');
            } else {
              arrow.removeClass('active');
            }
          }
        }
      ).fail(function () {
        alert('error');
      });
    });

    $(document).off('click', '.listDetail__button');
    $(document).on('click', '.listDetail__button', function () {
      var patent = $(this).closest('.listDetail__row'),
        url = '/basket/add2basket.php',
        id = $(this).data('id'),
        group = $(this).data('group'),
        type = $(this).data('type'),
        mark = $(this).data('mark'),
        surface = $(this).data('surface'),
        thickness = $(this).data('thickness'),
        width = $(this).data('width'),
        length = $(this).data('length'),
        height = $(this).data('height'),
        diameter = $(this).data('diameter'),
        count = $(this)
          .closest('.listDetail__row')
          .find('.counter__field')
          .val();

      if (patent.find('.counter__dimension').length) {
        //проверка на наличие у counter переключателя измерений
        var measure = patent
          .find('.counter__btn:checked + label')
          .data('measure');
      }

      if (count > 0) {
        $.post(
          url,
          {
            id: id,
            group: group,
            type: type,
            mark: mark,
            surface: surface,
            thickness: thickness,
            width: width,
            length: length,
            height: height,
            diameter: diameter,
            measure: measure,
            count: count,
          },
          function (data) {
            if ($('.basketSmallBtn__counter').length) {
              $('.basketSmallBtn__counter').html(
                $(data).find('.basketSmallBtn__text')
              );
            } else {
              $('.basketSmallBtn').append(
                $(data).find('.basketSmallBtn__counter')
              );
            }

            $('.header__right').prepend($(data).find('.basketPopup'));

            $('.basketPopup').animate({ opacity: 1 }, 300);

            setTimeout(function () {
              $('.basketPopup').fadeOut(300, function () {
                $(this).empty().remove();
              });
            }, 3300);

            //Yandex.Metrika
            ym(46768650, 'reachGoal', 'bask_up');
          }
        ).fail(function () {
          alert('error');
        });
      }
    });
  }
});

function DisabledButtonAdd2Basket() {
  if ($('.listDetail__row').length) {
    $('.listDetail__row').each(function () {
      var value = Number($(this).find('.counter__field').val());
      if (value <= 0) {
        $(this).find('.listDetail__button').addClass('disabled');
      } else {
        $(this).find('.listDetail__button').removeClass('disabled');
      }
    });
  }
}
$(document).ready(function () {
  if ($('.news').length) {
    var NEWS_PAGES = [$('.news__section')],
      NEWS_INNER_ELEMENT = $('.news__inner'),
      NEWS_PAGES_COUNT = NEWS_INNER_ELEMENT.data('pages'),
      NEWS_URL = NEWS_INNER_ELEMENT.data('url'),
      NEWS_SECTION = '',
      screenHeight = $(window).height();

    if (NEWS_PAGES_COUNT > 1) {
      if (NEWS_PAGES_COUNT !== NEWS_PAGES[NEWS_PAGES.length - 1].data('page')) {
        var isCanLoad = true;
      }

      function loadNews(scrollOffsetTop) {
        var CURRENT_NEWS_PAGE = NEWS_PAGES[NEWS_PAGES.length - 1],
          offsetToBottomLastPage =
            CURRENT_NEWS_PAGE.offset().top + CURRENT_NEWS_PAGE.outerHeight();

        /*Условия срабатывания загрузки следующей страницы*/
        if (
          scrollOffsetTop + screenHeight > offsetToBottomLastPage &&
          isCanLoad
        ) {
          isCanLoad = false;

          var curCountPage = parseInt(CURRENT_NEWS_PAGE.data('page')),
            url = NEWS_URL + '?PAGEN_1=' + (curCountPage + 1);

          $.get(url, { section: NEWS_SECTION }, function (data) {
            var newPage = $(data).find('.news__section');
            var newPagination = $(data).find('.pagination');

            newPage.appendTo(NEWS_INNER_ELEMENT);

            $('.pagination').html(newPagination.html());

            window.history.replaceState(
              {},
              '',
              NEWS_URL + 'page_' + (curCountPage + 1)
            );

            NEWS_PAGES.push(newPage);

            if (NEWS_PAGES_COUNT !== newPage.data('page')) {
              isCanLoad = true;
            }
          });
        }
      }
    }

    function initMoveToolbars() {
      var left = $('.newsArchive'),
        leftOffsetTop = left.offset().top,
        right = $('.pagination'),
        rightOffsetTop = right.offset().top,
        header = $('header'),
        headerOuterHeight = header.outerHeight(),
        addOffset = 80;

      return function move(scrollOffsetTop) {
        var screenOffsetTop = scrollOffsetTop + headerOuterHeight + addOffset;

        if (screenOffsetTop >= leftOffsetTop) {
          left.css({
            position: 'fixed',
            top: headerOuterHeight + addOffset + 'px',
          });
          right.css({
            position: 'fixed',
            top: headerOuterHeight + addOffset + 'px',
          });
        } else {
          left.removeAttr('style');
          right.removeAttr('style');
        }
      };
    }

    if ($('.newsArchive').length && $('.pagination').length) {
      var moveToolbars = initMoveToolbars();

      $(window).scroll(function () {
        if (NEWS_PAGES_COUNT > 1) {
          loadNews($(window).scrollTop());
        }

        moveToolbars($(window).scrollTop());
      });
    }
    function loadNewsSection(elem) {
      var url = elem.data('url'),
        section = elem.data('section');

      $.post(url, { section: section }, function (data) {
        var newPage = $(data).find('.news__section');

        $('.news__section').html($(data).find('.news__section').html());

        NEWS_PAGES = [$('.news__section')];
        NEWS_INNER_ELEMENT = $('.news__inner');
        NEWS_PAGES_COUNT = NEWS_INNER_ELEMENT.data('pages');

        window.history.replaceState({}, '', NEWS_URL);

        if (NEWS_PAGES_COUNT !== newPage.data('page')) {
          isCanLoad = true;
        }
      });
    }

    $(document).on('click', '.newsArchive__item', function () {
      loadNewsSection($(this));

      if ($('.newsArchive__item.active').length) {
        $('.newsArchive__item.active').removeClass('active');
      }

      $(this).addClass('active');
      $('.newsArchive__all').removeClass('active');
    });

    $(document).on('click', '.newsArchive__all', function () {
      loadNewsSection($(this));

      $(this).addClass('active');

      if ($('.newsArchive__item.active').length) {
        $('.newsArchive__item.active').removeClass('active');
      }
    });
  }
});
$(document).ready(function () {
  if ($('.newsArchive').length) {
    function switchShowContent() {
      var content = $('.newsArchive__content');

      content.slideToggle(500);
    }
    $(document).on('click', '.newsArchive__btn', function () {
      $(this).toggleClass('jQ_active');
      switchShowContent();
    });
  }
});
$(document).ready(function () {
  if ($('.orderFields__submit').length) {
    function checkFieldsAtEmptyAfterReload(selector) {
      $.each($(selector).find('input'), function (index, elem) {
        if ($(elem).val()) {
          $(elem).addClass('jQ_input_not_empty');
        }
      });

      if ($(selector).find('textarea').val()) {
        $(selector).find('textarea').addClass('jQ_input_not_empty');
      }
    }

    $(document).off('click', '.orderFields__submit');
    $(document).on('click', '.orderFields__submit', function (event) {
      event.preventDefault();

      var serialize = $(this).closest('form').serialize();

      var btn = $(this).find('.button'),
        isNotError = !$('.feedbackFormBasket').find('.feedbackFields_error')
          .length;

      if (isNotError) {
        btn
          .addClass('jQ_loader jQ_loader_white')
          .append(
            '<div class="button__loader"><span class="button__loaderOuter"><span></span><span></span><span></span></span></div>'
          );
      }

      $.post('/basket/sendOrderFromBasket.php', serialize, function (data) {
        if ($(data).find('.successOrder').length) {
          $('.basketSmallBtn__counter').empty().remove();

          $('main').fadeOut(250, function () {
            $('.basket').empty().remove();
            $('.feedbackFormBasket').empty().remove();

            $(this).fadeIn(250, function () {
              $(this).html($(data).find('.successOrder'));

              setTimeout(function () {
                window.location.pathname = '/catalog/';
              }, 3000);
            });
          });

          //Yandex.Metrika
          ym(46768650, 'reachGoal', 'sale_gut');
          //Comagic
          Comagic.addOfflineRequest({
            name: $('[name = orderName]').val(),
            email: $('[name = orderEmail]').val(),
            phone: $('[name = orderPhone]').val(),
            message: $('[name = orderComment]').val(),
          });
        } else {
          $('.feedbackFormBasket').html(
            $(data).find('.feedbackFormBasket').html()
          );

          checkFieldsAtEmptyAfterReload('.feedbackFormBasket__form');
        }
      }).fail(function () {
        alert('error');
      });
    });
  }
});
$(document).ready(function () {
  if ($('.pageInfo__btn')) {
    $(document).on('click', '.pageInfo__btn', function () {
      var scroll_el = $(this).attr('href'); // возьмем содержимое атрибута href, должен быть селектором, т.е. например начинаться с # или .
      if ($(scroll_el).length != 0) {
        // проверим существование элемента чтобы избежать ошибки
        $('html, body').animate({ scrollTop: $(scroll_el).offset().top }, 500); // анимируем скроолинг к элементу scroll_el
      }
      return false; // выключаем стандартное действие
    });
  }
});
$(window).on('load', function () {
  if ($('.pageNavigation').length) {
    function setActiveToPageNavigationLink(elem) {
      if ($('.jQ__pageNavigateActive').length) {
        $('.jQ__pageNavigateActive').removeClass('jQ__pageNavigateActive');
      }
      elem.addClass('jQ__pageNavigateActive');
    }

    function prescrollToAnchor(elem) {
      var id = elem.attr('href'),
        header = $('.header'),
        headerHeight = header.outerHeight(),
        addOffsetTop = 0;

      if (window.innerWidth < 1680) {
        addOffsetTop = 50;
      } else {
        addOffsetTop = 80;
      }

      var top = $(id).offset().top - headerHeight - addOffsetTop;

      $('body,html').animate({ scrollTop: top }, 500);
    }

    if (/truby/.test(window.location.pathname)) {
      // если переход по ссылке на трубы то скролим до них
      prescrollToAnchor($('a[href="#section2"]'));
    }

    $(document).on('click', '.pageNavigation a', function () {
      event.preventDefault();

      prescrollToAnchor($(this));
      setActiveToPageNavigationLink($(this));
    });

    var scrollPrevOffset = 0;

    var checkElements = $('.mainCatalog__title'); //массив элементов на которых меняем пункты меню

    checkElements.push(document.querySelector('#section2')); //добавляем элемент Трубы

    var menuItems = $('.pageNavigation__item'); //массив пунктов меню

    menuItems.push(document.querySelector('[href="#section2"]')); //добавляем элемент Трубы

    var curIndexActiveElement = 0;

    $.each(checkElements, function (index, elem) {
      if ($(window).scrollTop() + 154 > $(elem).offset().top) {
        curIndexActiveElement = index;
      }
    });

    var addOffsetTop = 0;

    if (window.innerWidth < 1680) {
      addOffsetTop = 50;
    } else {
      addOffsetTop = 80;
    }

    function setActiveMenuElemToScrollDown(scrollOffset) {
      var totlaOffset =
          scrollOffset + headerHeight + correctionOffset + addOffsetTop,
        elementOffsetTop = $(checkElements[curIndexActiveElement]).offset().top;

      if (totlaOffset > elementOffsetTop) {
        setActiveToPageNavigationLink($(menuItems[curIndexActiveElement]));

        if (curIndexActiveElement < checkElements.length - 1) {
          curIndexActiveElement++;
        }
      }
    }

    function setActiveMenuElemToScrollUp(scrollOffset) {
      var totlaOffset =
          scrollOffset + headerHeight + correctionOffset + addOffsetTop,
        elementOffsetTop = $(checkElements[curIndexActiveElement]).offset().top;

      if (curIndexActiveElement > 0) {
        if (totlaOffset < elementOffsetTop) {
          if (curIndexActiveElement !== 0) {
            curIndexActiveElement--;
          }

          setActiveToPageNavigationLink($(menuItems[curIndexActiveElement]));
        }
      } else {
        if (totlaOffset < elementOffsetTop) {
          $('.jQ__pageNavigateActive').removeClass('jQ__pageNavigateActive');
        }
      }
    }

    var blockToScroll = $('.pageNavigation');

    var headerHeight = $('header').outerHeight(),
      blockToScrollHeight = blockToScroll.outerHeight(),
      catalogMainHeight = $('.catalog__main').height();

    var blockOffsetTop = blockToScroll.offset().top,
      catalogMainOffsetTop = $('.catalog__main').offset().top;

    var correctionOffset = 76;

    function scrollDown(scrollOffset) {
      var totalOffset = scrollOffset + headerHeight + correctionOffset;

      if (totalOffset > blockOffsetTop) {
        blockToScroll.css({
          position: 'fixed',
          top: headerHeight + correctionOffset + 'px',
        });
      }
      if (
        blockToScroll.offset().top + blockToScrollHeight >
        catalogMainOffsetTop + catalogMainHeight
      ) {
        blockToScroll.css({
          position: 'absolute',
          top:
            $('.catalog__sidebar').outerHeight() -
            blockToScrollHeight -
            parseInt($('.catalog__content').css('padding-bottom')) +
            'px',
        });
      }

      setActiveMenuElemToScrollDown(scrollOffset);
    }

    scrollDown($(window).scrollTop());

    function scrollUp(scrollOffset) {
      var totalOffset = scrollOffset + headerHeight + correctionOffset;

      blockToScroll.css({
        position: 'fixed',
        top: headerHeight + correctionOffset + 'px',
      });

      if (totalOffset <= blockOffsetTop) {
        blockToScroll.removeAttr('style');
      }

      setActiveMenuElemToScrollUp(scrollOffset);
    }

    $(document).on('scroll', function () {
      var curScrollOffset = $(this).scrollTop();

      if (curScrollOffset > scrollPrevOffset) {
        //scroll down
        scrollDown(curScrollOffset);
      } else {
        //scroll up
        scrollUp(curScrollOffset);
      }

      scrollPrevOffset = curScrollOffset;
    });

    $(window).on('resize', function () {
      blockOffsetTop =
        $('.catalog__sidebar').offset().top +
        parseInt($('.catalog__sidebar').css('padding-top'));
    });
  }
});
$(document).ready(function () {
  if ($('.productSelection').length) {
    function animateFeedbackOrder() {
      var feedbackOrder = $('.feedbackOrder'),
        heightFeedbackOrderBlock = feedbackOrder.outerHeight(),
        productSelection = $('.productSelection'),
        paddingProductSelectionBlock = parseInt(
          productSelection.css('padding-bottom')
        ),
        heightProductSelectionBlock = productSelection.outerHeight(),
        addPadding = heightFeedbackOrderBlock - heightProductSelectionBlock;

      productSelection.css({
        opacity: '0',
        'padding-bottom': paddingProductSelectionBlock + addPadding + 'px',
      });

      setTimeout(function () {
        feedbackOrder.stop().fadeIn(250);
      }, 250);
    }

    $(document).on('click', '.productSelection__btn', function () {
      var file = $(this).data('file'),
        isSelectOrderBlockLoaded = $(this).data('selectorderblockload'),
        blockSelection = $('.detail__selection');

      if (isSelectOrderBlockLoaded) {
        animateFeedbackOrder();
      } else {
        $(this).data('selectorderblockload', true);

        $.post('/ajax/customOrder/' + file + '.php', function (data) {
          blockSelection.append($(data).find('.feedbackOrder'));
          animateFeedbackOrder();
          initScriptToSelectField(); //эта ф-ия обьявлена в компоненте selectField
          initScriptToSelectOrderBtn(); //эта ф-ия обьявлена в компоненте feedbackOrder
        }).fail(function () {
          alert('error');
        });
      }
    });
  }
});
$(document).ready(function () {
  if ($('.scheme').length) {
    $(document).on('click', '.scheme__tab', function () {
      var _$that = $(this);

      $('.scheme__tab.active').removeClass('active');

      $(this).addClass('active');

      $('.scheme__item.active').fadeOut(250, function () {
        $(this).removeClass('active');

        $('.scheme__item')
          .eq(_$that.index())
          .fadeIn(250, function () {
            $(this).addClass('active');
          });
      });
    });
  }
});
function checkCanMainPageScreensAnimation(elem, scrollOffsetTop, removeClass) {
  var elemHeight = elem.outerHeight(),
    screenHeight = $(window).outerHeight(),
    elemOffsetTop = elem.offset().top,
    relativePieceHeightElem = screenHeight * 0.2;

  if (screenHeight < 921) {
    if (
      scrollOffsetTop + screenHeight >
      elemOffsetTop + relativePieceHeightElem
    ) {
      elem.removeClass(removeClass);
    }
  } else {
    if (scrollOffsetTop + screenHeight > elemOffsetTop + 100) {
      elem.removeClass(removeClass);
    }
  }
}

$(document).ready(function () {
  $(window).scroll(function () {
    if ($('.screen2_wrapper.screen2_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.screen2_wrapper.screen2_animation'),
        $(window).scrollTop(),
        'screen2_animation'
      );
    }
    if ($('.title__accentText.screen2_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.title__accentText.screen2_animation'),
        $(window).scrollTop(),
        'screen2_animation'
      );
    }
    if ($('.title__text.screen2_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.title__text.screen2_animation'),
        $(window).scrollTop(),
        'screen2_animation'
      );
    }
    if ($('.screen2__description.screen2_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.screen2__description.screen2_animation'),
        $(window).scrollTop(),
        'screen2_animation'
      );
    }
    if ($('.screen2__features.screen2_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.screen2__features.screen2_animation'),
        $(window).scrollTop(),
        'screen2_animation'
      );
    }
    if ($('.screen2__btn.screen2_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.screen2__btn.screen2_animation'),
        $(window).scrollTop(),
        'screen2_animation'
      );
    }
  });
});
$(document).ready(function () {
  if ($('.screen3_animation').length) {
    var parent = $('.screen3__title'),
      donor = $('.screen3_animation .title'),
      clone1 = donor.clone().addClass('clone1 screen3_animation'),
      clone2 = donor.clone().addClass('clone2 screen3_animation');

    clone1.find('.title__text').css('opacity', '0');
    clone1.appendTo(parent);

    clone2.find('.title__accentText').css('opacity', '0');
    clone2.appendTo(parent);
  }
  $(window).scroll(function () {
    if ($('.screen3_wrapper.screen3_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.screen3_wrapper.screen3_animation'),
        $(window).scrollTop(),
        'screen3_animation'
      );
    }
    if ($('.clone1.screen3_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.clone1.screen3_animation'),
        $(window).scrollTop(),
        'screen3_animation'
      );
    }
    if ($('.clone2.screen3_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.clone2.screen3_animation'),
        $(window).scrollTop(),
        'screen3_animation'
      );
    }
    if ($('.screen3__description.screen3_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.screen3__description.screen3_animation'),
        $(window).scrollTop(),
        'screen3_animation'
      );
    }
    if ($('.screen3__group1.screen3_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.screen3__group1.screen3_animation'),
        $(window).scrollTop(),
        'screen3_animation'
      );
    }
    if ($('.screen3__group2.screen3_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.screen3__group2.screen3_animation'),
        $(window).scrollTop(),
        'screen3_animation'
      );
    }
  });
});
$(window).on('load', function () {
  if ($('.screen4_animation').length) {
    var ship = $('.screen4__ship'),
      shipWidth = ship.width(),
      longWay = shipWidth,
      curOffsetLeft = -shipWidth / 1.5;

    ship.css('transform', 'translate3d(' + curOffsetLeft + 'px, 0, 0)');

    function shipAnimation(scrollOffsetTop) {
      var shipOffsetTop = ship.offset().top,
        windowScreenHeight = $(window).height(),
        start = scrollOffsetTop + windowScreenHeight - shipOffsetTop;

      if (start >= 0 && start <= windowScreenHeight + ship.height()) {
        var ratioOffsetX = start / (windowScreenHeight + ship.height());

        var newOffsetLeft = curOffsetLeft + longWay * ratioOffsetX;

        ship.css('transform', 'translate3d(' + newOffsetLeft + 'px, 0, 0)');
      }
    }
  }

  $(window).scroll(function () {
    if ($('.title__text.screen4_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.title__text.screen4_animation'),
        $(window).scrollTop(),
        'screen4_animation'
      );
    }
    if ($('.title__accentText.screen4_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.title__accentText.screen4_animation'),
        $(window).scrollTop(),
        'screen4_animation'
      );
    }
    if ($('.screen4__text.screen4_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.screen4__text.screen4_animation'),
        $(window).scrollTop(),
        'screen4_animation'
      );
    }
    if ($('.screen4__howWeWork.screen4_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.screen4__howWeWork.screen4_animation'),
        $(window).scrollTop(),
        'screen4_animation'
      );
    }
    if ($('.screen4_animation').length) {
      shipAnimation($(window).scrollTop());
    }
  });
});
$(document).ready(function () {
  if ($('.screen5_animation').length) {
    function carAnimation(scrollOffsetTop) {
      var halfWindowHeight = $(window).height() / 2,
        car = $('.screen5__car'),
        carOffsetTop = car.offset().top;

      if (scrollOffsetTop + halfWindowHeight >= carOffsetTop) {
        car.removeClass('screen5_animation');
      }
    }
  }

  $(window).scroll(function () {
    if ($('.title__text.screen5_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.title__text.screen5_animation'),
        $(window).scrollTop(),
        'screen5_animation'
      );
    }
    if ($('.title__accentText.screen5_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.title__accentText.screen5_animation'),
        $(window).scrollTop(),
        'screen5_animation'
      );
    }
    if ($('.screen5__description.screen5_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.screen5__description.screen5_animation'),
        $(window).scrollTop(),
        'screen5_animation'
      );
    }
    if ($('.screen5__btn.screen5_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.screen5__btn.screen5_animation'),
        $(window).scrollTop(),
        'screen5_animation'
      );
    }
    if ($('.screen5__car.screen5_animation').length) {
      carAnimation($(window).scrollTop());
    }
  });
});
$(document).ready(function () {
  if ($('.screen6_animation').length) {
    var parent = $('.screen6__title'),
      donor = $('.screen6_animation .title'),
      screen6_TitleClone1 = donor.clone().addClass('clone1 screen6_animation'),
      screen6_TitleClone2 = donor.clone().addClass('clone2 screen6_animation');

    screen6_TitleClone1.find('.title__text').css('opacity', '0');
    screen6_TitleClone1.appendTo(parent);

    screen6_TitleClone2.find('.title__accentText').css('opacity', '0');
    screen6_TitleClone2.appendTo(parent);

    var isCanAddRouteAnimate = true;

    function startRouteAnimation(elem, scrollOffsetTop) {
      var elemHeight = elem.outerHeight(),
        screenHeight = $(window).outerHeight(),
        elemOffsetTop = elem.offset().top,
        relativePieceHeightElem = elemHeight * 0.2;

      if (
        scrollOffsetTop + screenHeight >
        elemOffsetTop + relativePieceHeightElem
      ) {
        isCanAddRouteAnimate = false;
        var animData = {
          container: document.querySelector('.screen6__route'),
          renderer: 'svg',
          path: '/local/templates/main/jsonAnimation/route.json',
        };

        var amin = bodymovin.loadAnimation(animData);
        amin.setSpeed(2);
      }
    }
  }

  $(window).scroll(function () {
    if ($('.screen6_animation').length && isCanAddRouteAnimate) {
      startRouteAnimation($('.screen6_animation'), $(window).scrollTop());
    }
    if ($('.clone1.screen6_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.clone1.screen6_animation'),
        $(window).scrollTop(),
        'screen6_animation'
      );
    }
    if ($('.clone2.screen6_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.clone2.screen6_animation'),
        $(window).scrollTop(),
        'screen6_animation'
      );
    }
    if ($('.screen6__description.screen6_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.screen6__description.screen6_animation'),
        $(window).scrollTop(),
        'screen6_animation'
      );
    }
    if ($('.screen6__btn.screen6_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.screen6__btn.screen6_animation'),
        $(window).scrollTop(),
        'screen6_animation'
      );
    }
  });

  if ($('.screen6').length) {
    $(document).on('click', '.screen6__btn', function () {
      var popup = $('.screen6__feedback'),
        form = $('.feedbackPriceInquiry');

      popup.fadeIn(500, function () {
        form.removeClass('feedbackPriceInquiry_animate');
      });
    });
  }
});
$(document).ready(function () {
  if ($('.screen7_animation').length) {
    var parent = $('.screen7__title'),
      donor = $('.screen7_animation .title'),
      screen7_TitleClone1 = donor.clone().addClass('clone1 screen7_animation'),
      screen7_TitleClone2 = donor.clone().addClass('clone2 screen7_animation');

    screen7_TitleClone1.find('.title__text').css('opacity', '0');
    screen7_TitleClone1.appendTo(parent);

    screen7_TitleClone2.find('.title__accentText').css('opacity', '0');
    screen7_TitleClone2.appendTo(parent);
  }
  $(window).scroll(function () {
    if ($('.clone1.screen7_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.clone1.screen7_animation'),
        $(window).scrollTop(),
        'screen7_animation'
      );
    }
    if ($('.clone2.screen7_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.clone2.screen7_animation'),
        $(window).scrollTop(),
        'screen7_animation'
      );
    }
    if ($('.screen7__description.screen7_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.screen7__description.screen7_animation'),
        $(window).scrollTop(),
        'screen7_animation'
      );
    }
    if ($('.screen7__group1.screen7_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.screen7__group1.screen7_animation'),
        $(window).scrollTop(),
        'screen7_animation'
      );
    }
    if ($('.screen7__group2.screen7_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.screen7__group2.screen7_animation'),
        $(window).scrollTop(),
        'screen7_animation'
      );
    }
    if ($('.screen7__group3.screen7_animation').length) {
      checkCanMainPageScreensAnimation(
        $('.screen7__group3.screen7_animation'),
        $(window).scrollTop(),
        'screen7_animation'
      );
    }
  });
});
$(document).ready(function () {
  if ($('.screen8_animation').length) {
    $(window).scroll(function () {
      if ($('.title__text.screen8_animation').length) {
        checkCanMainPageScreensAnimation(
          $('.title__text.screen8_animation'),
          $(window).scrollTop(),
          'screen8_animation'
        );
      }
      if ($('.title__accentText.screen8_animation').length) {
        checkCanMainPageScreensAnimation(
          $('.title__accentText.screen8_animation'),
          $(window).scrollTop(),
          'screen8_animation'
        );
      }
      if ($('.screen8__description.screen8_animation').length) {
        checkCanMainPageScreensAnimation(
          $('.screen8__description.screen8_animation'),
          $(window).scrollTop(),
          'screen8_animation'
        );
      }
      if ($('.screen8__btn.screen8_animation').length) {
        checkCanMainPageScreensAnimation(
          $('.screen8__btn.screen8_animation'),
          $(window).scrollTop(),
          'screen8_animation'
        );
      }
    });
  }
});
$(document).ready(function () {
  if ($('.screenCommonBg').length) {
    var svgHeight = $('.screenCommonBg__img svg').height();
    $('.screenCommonBg__img svg').css('marginTop', -svgHeight / 2);
    $(window).resize(function () {
      var svgHeight = $('.screenCommonBg__img svg').height();
      $('.screenCommonBg__img svg').css('marginTop', -svgHeight / 2);
    });
    var scrollStart = $(window).scrollTop();
    var canMove = false;
    var block = false;
    var kRoute = 0.3;
    var anim_route =
      $('.screen8__description').offset().top +
      $(window).height() * 0.2 -
      $('.screen7__group3').offset().top;
    var numFrames = 179;
    var animK = numFrames / anim_route;
    var scrolled = 0;
    var map = lottie.loadAnimation({
      container: document.querySelector('.screenCommonBg__img'),
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: '/local/templates/main/jsonAnimation/map.json',
      rendererSettings: {
        scaleMode: 'noScale',
        clearCanvas: false,
        progressiveLoad: false,
        hideOnTransparent: true,
        className: 'some-css-class-name',
      },
    });

    $(window).scroll(function () {
      var svgHeight = $('.screenCommonBg__img svg').height();
      $('.screenCommonBg__img svg').css('marginTop', -svgHeight / 2);
      var scrollRoute = scrollStart - $(window).scrollTop();
      scrollStart = $(window).scrollTop();
      if (scrollRoute < 0) {
        if (
          $('.screenCommonBg .title.clone1').offset().top <=
          $(window).scrollTop() +
            $(window).height() * 1 -
            $(window).height() / 2
        ) {
          $('.screenCommonBg__img').addClass('show');
        }
        if (
          $('.screen9__title').offset().top <=
          $(window).scrollTop() + $(window).height() * 0.85
        ) {
          $('.screenCommonBg__img').addClass('hide');
          map.goToAndStop(numFrames, true);
        }
      } else {
        if (
          $('.screenCommonBg .title.clone1').offset().top >=
          $(window).scrollTop() +
            $(window).height() * 1 -
            100 -
            $(window).height() / 2
        ) {
          $('.screenCommonBg__img').removeClass('show');
          map.goToAndStop(0, true);
          scrolled = 0;
        }
        if (
          $('.screen9__title').offset().top >=
          $(window).scrollTop() + $(window).height() * 0.85
        ) {
          $('.screenCommonBg__img').removeClass('hide');
        }
      }
      if (
        $('.screen8 .title').offset().top <=
        $(window).scrollTop() + $(window).height() * 1.2
      ) {
        if (scrollRoute < 0) {
          scrolled = scrolled + Math.abs(scrollRoute);
        } else {
          scrolled = scrolled - Math.abs(scrollRoute);
        }
        frame = scrolled * animK;
        if (frame > numFrames) frame = numFrames;
        if (frame < 0) frame = 0;
        map.goToAndStop(Math.round(frame), true);
      } else {
        if (scrollRoute > 0) {
          map.goToAndStop(0, true);
        }
      }
      if (scrollRoute < 0) {
        if (
          $('.screen8 .title').offset().top <=
          $(window).scrollTop() + $(window).height() * 0.6
        ) {
          $('.screenCommonBg__img').addClass('block');
        }
      } else {
        if (
          $('.screen8 .title').offset().top >=
          $(window).scrollTop() + $(window).height() * 0.6
        ) {
          $('.screenCommonBg__img').removeClass('block');
        }
      }
    });
  }
});
$(document).ready(function () {
  if ($('.screen9_animation').length) {
    $(window).scroll(function () {
      if ($('.title__text.screen9_animation').length) {
        checkCanMainPageScreensAnimation(
          $('.title__text.screen9_animation'),
          $(window).scrollTop(),
          'screen9_animation'
        );
      }
      if ($('.title__accentText.screen9_animation').length) {
        checkCanMainPageScreensAnimation(
          $('.title__accentText.screen9_animation'),
          $(window).scrollTop(),
          'screen9_animation'
        );
      }
      if ($('.screen9__description.screen9_animation').length) {
        checkCanMainPageScreensAnimation(
          $('.screen9__description.screen9_animation'),
          $(window).scrollTop(),
          'screen9_animation'
        );
      }
      if ($('.screen9__form.screen9_animation').length) {
        checkCanMainPageScreensAnimation(
          $('.screen9__form.screen9_animation'),
          $(window).scrollTop(),
          'screen9_animation'
        );
      }
    });
  }
});
function setToSelectField(elem, str) {
  if ($(elem).data(str)) {
    var name = $(elem).data(str);

    if ($(elem).find('.selectField__name')) {
      var forSetToFieldName = $(elem).find('.selectField__name');
      forSetToFieldName.text(name);
    }

    if ($(elem).find('.selectField__type')) {
      var forSetToFieldType = $(elem).find('.selectField__type');
      forSetToFieldType.text(name);
    }
  }
}

function initScriptToSelectField() {
  //ф-ия вызывается в компоненте productSelection
  $.each($('.selectField__list.scroller'), function (index, elem) {
    baron(elem);
  }); /*custom scroll init*/

  function showSelectFieldList(elem) {
    var parent = elem.closest('.selectField'),
      icon = parent.find('.selectField__icon').length
        ? parent.find('.selectField__icon')
        : parent.find('.selectField__ico'),
      list = parent.find('.selectField__list'),
      activeIcon = $('.selectField__icon.jQ_active'),
      openList = $('.selectField__list.jQ_active');

    if (list.hasClass('jQ_active')) {
      list.stop().fadeOut(250);
      icon.removeClass('jQ_active');
      list.removeClass('jQ_active');
    } else {
      if (openList.length) {
        openList.fadeOut(250);
        activeIcon.removeClass('jQ_active');
        openList.removeClass('jQ_active');
      }
      list.stop().fadeIn(250);
      icon.addClass('jQ_active');
      list.addClass('jQ_active');
    }
  }

  function inputValidationToSelectOrder(elem) {
    var val = elem.val();

    if (val) {
      elem.closest('.selectField').addClass('jQ_active');
    } else {
      elem.closest('.selectField').removeClass('jQ_active');
    }

    if (/\D/gi.test('' + val)) {
      elem.val(elem.val().slice(0, -1));
    }
  }

  function getInputDataFromSelectOrder(elem) {
    var parent = elem.closest('.selectField'),
      val = elem.val();

    if (val) {
      parent.addClass('jQ_active');
    } else {
      parent.removeClass('jQ_active');
    }

    if (elem.hasClass('thickness')) {
      parent.data('thickness', val);
    }

    if (elem.hasClass('width')) {
      parent.data('width', val);
    }

    if (elem.hasClass('length')) {
      parent.data('length', val);
    }

    if (elem.hasClass('height')) {
      parent.data('height', val);
    }
  }

  function setItemActive(elem) {
    var parent = $(elem).parent(),
      activeElem = parent.find('.active');

    activeElem.removeClass('active');
    elem.addClass('active');
  }

  $(document).off('click', '.selectField__name');
  $(document).on('click', '.selectField__name', function () {
    showSelectFieldList($(this));
  });

  $(document).off('click', '.selectField__type');
  $(document).on('click', '.selectField__type', function () {
    showSelectFieldList($(this));
  });

  $(document).off('click', '.selectField__item');
  $(document).on('click', '.selectField__item', function () {
    setItemActive($(this));

    var parent = $(this).closest('.selectField'),
      icon = parent.find('.selectField__icon').length
        ? parent.find('.selectField__icon')
        : parent.find('.selectField__ico'),
      list = parent.find('.selectField__list'),
      text = $(this).text();

    if ($(this).hasClass('name')) {
      parent.data('name', text);

      setToSelectField(parent, 'name');
    }

    if ($(this).hasClass('type')) {
      parent.data('type', text);

      var fieldLength = $('.feedbackOrder__field').eq(5);

      setToSelectField(parent, 'type');

      if ($(this).index() == 1 || $(this).index() == 2) {
        fieldLength.css({ 'pointer-events': 'none', opacity: 0.25 });
      } else {
        fieldLength.removeAttr('style');
      }
    }

    if ($(this).hasClass('surface')) {
      parent.data('surface', text);

      setToSelectField(parent, 'surface');
    }

    icon.removeClass('jQ_active');
    list.stop().fadeOut(250);
    list.removeClass('jQ_active');
  });

  $(document).off('input', '.selectField__input');
  $(document).on('input', '.selectField__input', function () {
    inputValidationToSelectOrder($(this));
  });

  $(document).off('input', '.selectField__field');
  $(document).on('input', '.selectField__field', function () {
    inputValidationToSelectOrder($(this));
  });

  $(document).off('blur', '.selectField__input');
  $(document).on('blur', '.selectField__input', function () {
    getInputDataFromSelectOrder($(this));
  });

  $(document).off('blur', '.selectField__field');
  $(document).on('blur', '.selectField__field', function () {
    getInputDataFromSelectOrder($(this));
  });

  $(document).off('click', '.selectField__radio label');
  $(document).on('click', '.selectField__radio label', function () {
    var parent = $(this).closest('.selectField'),
      text = $(this).text();

    if ($(this).hasClass('type')) {
      parent.data('type', text);
    }

    if ($(this).hasClass('view')) {
      parent.data('view', text);
    }
  });
}
$(document).ready(function () {
  if ($('.stainless').length) {
    var charItems = $('.stainless__chart li');

    $.each(charItems, function (index, elem) {
      var width = $(elem).data('width');

      width = String(width).split(/-/);

      if (width.length > 1) {
        var part_one = parseFloat(width[width.length - 1].replace(',', '.'));
        var part_two = parseFloat(width[0].replace(',', '.'));

        var part = (part_one - part_two) / 2;

        width = part_two + part;

        $(elem).css('width', +width + '%');
      } else {
        width = parseFloat(width[0].replace(',', '.'));

        $(elem).css('width', width + '%');
      }
    });

    var dataElements = $('.stainless__data li'),
      chartElements = $('.stainless__chart li');

    $(document)
      .on('mouseenter', '.stainless__data dl', function () {
        var curIndex = $(this).closest('li').index();

        $.each(dataElements, function (i, elem) {
          if (i !== curIndex) {
            $(elem).addClass('hide');
          } else {
            $(elem).removeClass('hide');
          }
        });
        $.each(chartElements, function (i, elem) {
          if (i !== curIndex) {
            $(elem).addClass('hide');
          } else {
            $(elem).removeClass('hide');
          }
        });
      })
      .on('mouseleave', '.stainless__data dl', function () {
        $.each(dataElements, function (i, elem) {
          $(elem).removeClass('hide');
        });
        $.each(chartElements, function (i, elem) {
          $(elem).removeClass('hide');
        });
      })
      .on('mouseenter', '.stainless__chart li', function () {
        var curIndex = $(this).index();

        $.each(dataElements, function (i, elem) {
          if (i !== curIndex) {
            $(elem).addClass('hide');
          } else {
            $(elem).removeClass('hide');
          }
        });
      })
      .on('mouseleave', '.stainless__chart li', function () {
        $.each(dataElements, function (i, elem) {
          $(elem).removeClass('hide');
        });
      });
  }
});
$(document).ready(function () {
  $(document).on('click', '.surface-types__card', function () {
    var scroll_el = $(this).attr('href'); // возьмем содержимое атрибута href, должен быть селектором, т.е. например начинаться с # или .

    var headerHeight = $('header').outerHeight();

    if ($(scroll_el).length != 0) {
      // проверим существование элемента чтобы избежать ошибки
      $('html, body').animate(
        { scrollTop: $(scroll_el).offset().top - headerHeight - 20 },
        500
      ); // анимируем скроолинг к элементу scroll_el
    }
    return false; // выключаем стандартное действие
  });
});
$(document).ready(function () {
  if ($('.tabs').length) {
    $(document).on('click', '.tabs__title', function () {
      var _$that = $(this);

      $('.tabs__title.active').removeClass('active');

      $(this).addClass('active');

      $('.tabs__item.active').fadeOut(250, function () {
        $(this).removeClass('active');

        $('.tabs__item')
          .eq(_$that.index())
          .fadeIn(250, function () {
            $(this).addClass('active');
          });
      });
    });
  }
});
$(document).ready(function () {
  if ($('.vacancies__item').length) {
    function toggleVacacy(elem) {
      var parent = elem.closest('.vacancies__item'),
        content = parent.find('.vacancy__content'),
        title = parent.find('.vacancy__title');

      if (parent.hasClass('jQ_active')) {
        parent.removeClass('jQ_active');

        content.slideUp();
      } else {
        if ($('.vacancies__item.jQ_active').length) {
          $('.vacancies__item.jQ_active')
            .removeClass('jQ_active')
            .find('.vacancy__content')
            .slideUp();

          parent.addClass('jQ_active');

          content.slideDown(function () {
            $('html, body').animate(
              { scrollTop: title.offset().top - 100 },
              500
            ); // анимируем скроолинг к элементу scroll_el
          });
        } else {
          parent.addClass('jQ_active');

          content.slideDown(function () {
            $('html, body').animate(
              { scrollTop: title.offset().top - 100 },
              500
            ); // анимируем скроолинг к элементу scroll_el
          });
        }
      }
    }

    $(document)
      .on('click', '.vacancy__header', function () {
        toggleVacacy($(this));
      })
      .on('click', '.vacancy__btn', function () {
        var scroll_el = $(this).attr('href'); // возьмем содержимое атрибута href, должен быть селектором, т.е. например начинаться с # или .
        if ($(scroll_el).length != 0) {
          // проверим существование элемента чтобы избежать ошибки
          $('html, body').animate(
            { scrollTop: $(scroll_el).offset().top },
            500
          ); // анимируем скроолинг к элементу scroll_el
        }

        var text = $(this)
          .closest('.vacancy')
          .find('.vacancy__title')
          .text()
          .trim();

        $('#VACANCY_VACANCY')
          .val('' + text)
          .addClass('jQ_input_not_empty');

        return false; // выключаем стандартное действие
      });
  }
});
function removeDisclaimer() {
  if (
    $.cookie('disable_disclaimer') &&
    JSON.parse($.cookie('disable_disclaimer'))
  ) {
    var parent = document.querySelector('header'),
      child = document.querySelector('.disclaimer');

    parent.removeChild(child);
  }
}

removeDisclaimer();

$(document).ready(function () {
  $('.disclaimer__close').click(function () {
    var parent = document.querySelector('header'),
      child = document.querySelector('.disclaimer');

    parent.removeChild(child);

    $.cookie('disable_disclaimer', true);
  });
});
$(document).ready(function () {
  $(document).on('click', '.footer__left a', function () {
    //Yandex.Metrika
    ym(46768650, 'reachGoal', 'click_mail_footer');

    return true;
  });
});
$(document).ready(function () {
  $(document).scroll(function () {
    HeaderFixed();
  });
});

function HeaderFixed() {
  if ($(document).scrollTop() > $('header').height()) {
    $('header').addClass('fixed');
  } else {
    $('header').removeClass('fixed');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('.firstScreenAnimate')) {
    document.querySelector('.preloader').style.display = 'none';
  }
});

$(window).on('load', function () {
  if (!$('.firstScreenAnimate').length) {
    $('.preloader').fadeOut(700);
  }

  $(document).on('click', 'a[href]', function (e) {
    e.preventDefault();

    var url = $(this).attr('href');

    if (/#/.test(url)) {
      return true;
    } else {
      $('.preloader').fadeIn(700, function () {
        window.location.href = url;
      });
    }
  });
});
$(document).ready(function () {
  if ($('.siteMap').length) {
    function openCloseSiteMap(elem) {
      var btn = elem;
      var popup = elem.parents('.siteMap').find('.siteMap__popup');

      if (!btn.hasClass('active')) {
        btn.addClass('active');
        popup.stop().fadeIn(500, function () {});
      } else if (btn.hasClass('active')) {
        btn.removeClass('active');
        popup.stop().fadeOut(500, function () {});
      }
    }
    $(document)
      .on('click', '.siteMap__switch', function (e) {
        openCloseSiteMap($(this));

        e.stopImmediatePropagation();
      })
      .on('keyup', function (event) {
        switch (event.keyCode) {
          case 27: {
            $('.siteMap__switch').removeClass('active');
            $('.siteMap__switch')
              .parents('.siteMap')
              .find('.siteMap__popup')
              .stop()
              .fadeOut(500);
          }
        }
      });
  }
});

$(document).ready(function () {
  // const menuItem = document.querySelectorAll('.siteMap__menuItem');
  // // each menuItem is collapsed by default
  // menuItem.forEach(function (item) {
  //   if (item.querySelector('.siteMap__menuItemTitle')) {
  //     const itemTitle = item.querySelector('.siteMap__menuItemTitle');

  //     itemTitle.addEventListener('click', function (e) {
  //       item.classList.toggle('active');
  //     });
  //   }
  // });

  // const catalogItemBlock = document.querySelector(
  //   '.siteMap__cellCatalog .menu__item'
  // );
  // const catalogItem = document.querySelector(
  //   '.siteMap__cellCatalog .menu__item > div'
  // );
  // const catalogItemTitle = document.querySelector(
  //   '.siteMap__cellCatalog .siteMap__menuItemTitle'
  // );

  // if (catalogItemBlock && catalogItem && catalogItemTitle) {
  //   catalogItemTitle.addEventListener('click', function (e) {
  //     catalogItemBlock.classList.toggle('active');
  //   });
  // }

  const menuItemTitles = document.querySelectorAll('.siteMap__menuItemTitle');
  menuItemTitles.forEach(function (itemTitle) {
    itemTitle.addEventListener('click', function (e) {
      itemTitle.parentElement.classList.toggle('active');
    });
  });
});
