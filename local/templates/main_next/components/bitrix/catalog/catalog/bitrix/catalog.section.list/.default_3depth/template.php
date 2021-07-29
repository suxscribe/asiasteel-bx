<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
/** @var array $arParams */
/** @var array $arResult */
/** @global CMain $APPLICATION */
/** @global CUser $USER */
/** @global CDatabase $DB */
/** @var CBitrixComponentTemplate $this */
/** @var string $templateName */
/** @var string $templateFile */
/** @var string $templateFolder */
/** @var string $componentPath */
/** @var CBitrixComponent $component */
$this->setFrameMode(true);

$strSectionEdit = CIBlock::GetArrayByID($arParams["IBLOCK_ID"], "SECTION_EDIT");
$strSectionDelete = CIBlock::GetArrayByID($arParams["IBLOCK_ID"], "SECTION_DELETE");
$arSectionDeleteParams = array("CONFIRM" => GetMessage('CT_BCSL_ELEMENT_DELETE_CONFIRM'));
//if(isset($arParams['SHOW_ONLY_SPEC']) && $arParams['SHOW_ONLY_SPEC']=='listovoy-prokat'){
//    $section_show = 0;
//}elseif(isset($arParams['SHOW_ONLY_SPEC']) && $arParams['SHOW_ONLY_SPEC']=='truby'){
//    $section_show = 1;
//}else{
//    $section_show = -1;
//}
//$hide_truby = (isset($arParams['SHOW_ONLY_SPEC']) && $arParams['SHOW_ONLY_SPEC']=='listovoy-prokat')?'style = "display:none"':'';
//$hide_list = (isset($arParams['SHOW_ONLY_SPEC']) && $arParams['SHOW_ONLY_SPEC']=='truby')?'style = "display:none"':'';
//$strH1 = $APPLICATION->GetPageProperty("page_h1");
?>
<a href="/catalog/" class="detail__back">
	<div class="button button_style6">
		<div class="button_style6__icon">
			<svg width="5px" height="8px" viewBox="0 0 5 8" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
					<g transform="translate(-898.000000, -122.000000)" fill="#808080">
						<g transform="translate(542.000000, 108.000000)">
							<g transform="translate(336.000000, 0.000000)">
								<g transform="translate(20.000000, 7.000000)">
									<g transform="translate(2.500000, 11.000000) rotate(90.000000) translate(-2.500000, -11.000000) translate(-1.000000, 9.000000)">
										<polygon points="6.26203348 8.23785484e-14 7 0.664898192 3.49982956 3.81818182 0 0.664881102 0.738004456 1.70894234e-05 3.4998675 2.48841961"></polygon>
									</g>
								</g>
							</g>
						</g>
					</g>
				</g>
			</svg>
		</div>
		<span class="button_style6__text">Весь каталог</span>
	</div>
</a>
<div class="catalog__title catalog__title--3rd">
    каталог продукции
</div>
<!--<pre>--><?//=var_dump($arResult)?><!--</pre>-->
<div class="catalog__content">
<?if (0 < $arResult["SECTIONS_COUNT"]) {?>
    <div class="catalog__sidebar">
    </div>
    <div class="catalog__main">
        <h1 id="section1" class="catalog__subtitle"><?echo $arResult['SECTION']['H1']?>
<!--            --><?//echo $APPLICATION->GetTitle();?>
<!--            --><?//$APPLICATION->AddBufferContent('ShowCondTitle');?>
        </h1>
            <div class="mainCatalog" <?=$hide_list?>>
                <?  $count = 1;
                    ?>
                            <div class="mainCatalog___items">
                                <?foreach ($arResult['SECTIONS'] as $arSubItem){?>
                                    <a href="<?=$arSubItem['SECTION_PAGE_URL']?>" class="mainCatalog__card">
                                        <div class="card">
                                            <h2 class="card__title">
                                                <?=$arSubItem['NAME']?>
                                            </h2>
                                            <div class="card__subtitle">
                                                <?=$arSubItem['CUSTOM_FIELDS']['CUSTOM_TITLES']?>
                                            </div>
                                            <div class="card__text">
                                                Толщина: <?=$arSubItem['CUSTOM_FIELDS']['UF_MIN_MAX_THICKNESS']?> мм
                                            </div>
                                            <div class="card__text">
                                                В каталоге: <?=$arSubItem['ELEMENT_CNT']?> <?=$arSubItem['CUSTOM_FIELDS']['CUSTOM_CNT_DECLINATIONS']?>
                                            </div>
                                        </div>
                                    </a>
                                <?}?>
                            </div>
                <?$count++;?>
            </div>
    </div>
<?}else{?>
    <div class="catalog__sidebar">
    </div>
    <div class="catalog__main">
        <h1 id="section1" class="catalog__subtitle"><?echo $arResult['IPROPERTY_VALUES']['SECTION_PAGE_TITLE']?></h1>
    </div>
<?}?>

</div>
