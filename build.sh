echo 'build start'

git reset --hard origin/master
git clean -f
git pull
npm i
npm run build:h5

# 小玩具项目都cp到下面这个文件夹下，直接访问

if [ ! -d "/var/www/toy/myFund/" ]; then
  mkdir /var/www/toy/myFund/
fi

cp -rf /var/www/myFund/dist/* /var/www/toy/myFund/

echo 'build end'