---
title: Pet Hamster
image: ./docs/images/generated/sample_pet_hamster.png
---

![Pet hamster icon](../images/generated/icon_sample_pet_hamster.png){:class="icon-sample"}

![Pet Hamster MicroCode program](../images/generated/sample_pet_hamster.png){:class="sample"}

Keep your micro:pet happy by petting
its head (Logo) and don't shake it, it does not like that.

![when page started, paint screen neutral](../images/generated/sample_pet_hamster_page_1_rule_1.png){:class="rule"}

-   **when** ![page start](../images/generated/icon_S1.png){:class="icon"} page started, **do** ![screen](../images/generated/icon_A5.png){:class="icon"} show image neutral mood

Touching the micro:bit logo makes it happy.

![when touch logo, print happy on screen](../images/generated/sample_pet_hamster_page_1_rule_2.png){:class="rule"}

-   **when** ![press](../images/generated/icon_S2.png){:class="icon"} press ![logo](../images/generated/icon_F7.png){:class="icon"} micro:bit logo, **do** ![screen](../images/generated/icon_A5.png){:class="icon"} show image happy animation and ![repeat](../images/generated/icon_M23.png){:class="icon"} repeat ![value 3](../images/generated/icon_M8.png){:class="icon"} 3 times.

![when touch logo, play giggle sound](../images/generated/sample_pet_hamster_page_1_rule_3.png){:class="rule"}

-   **when** ![press](../images/generated/icon_S2.png){:class="icon"} press ![logo](../images/generated/icon_F7.png){:class="icon"} micro:bit logo, **do** ![speaker](../images/generated/icon_A2.png){:class="icon"} play sound emoji ![emoji giggle](../images/generated/icon_M19giggle.png){:class="icon"} giggle.

Shaking makes it unhappy.

![when touch logo, print frowney on screen](../images/generated/sample_pet_hamster_page_1_rule_4.png){:class="rule"}

-   **when** ![accelerometer](../images/generated/icon_S3.png){:class="icon"} ![shake](../images/generated/icon_F17_shake.png){:class="icon"} shake, **do** ![screen](../images/generated/icon_A5.png){:class="icon"} show image unhappy animation and ![repeat](../images/generated/icon_M23.png){:class="icon"} repeat ![value 3](../images/generated/icon_M8.png){:class="icon"} 3 times.

![when touch logo, play sad sound](../images/generated/sample_pet_hamster_page_1_rule_5.png){:class="rule"}

-   **when** ![accelerometer](../images/generated/icon_S3.png){:class="icon"} ![shake](../images/generated/icon_F17_shake.png){:class="icon"} shake, **do** ![speaker](../images/generated/icon_A2.png){:class="icon"} play sound emoji ![emoji sad](../images/generated/icon_M19sad.png){:class="icon"} sad.

## improvement ideas

-   use more rules to manipulate the mood of your pet
