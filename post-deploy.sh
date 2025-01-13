# WIP: Is not used by the deploy mechanism yet
rm -rf ../httpdocs/wp-content/themes/eee-theme
cp -r ./themes/eee-theme ../httpdocs/wp-content/themes/eee-theme

rm -rf ../httpdocs/wp-content/plugins/eee23-blocks
cp -r ./plugins/eee23-blocks ../httpdocs/wp-content/plugins/eee23-blocks

rm -rf ../httpdocs/wp-content/plugins/eee23-mail-config
cp -r ./plugins/eee23-mail-config ../httpdocs/wp-content/plugins/eee23-mail-config