import type { Category } from '@/types';

export const categories: Category[] = [
  {
    slug: 'gao-binh-dan',
    name: 'Gạo Bình Dân',
    shortName: 'Bình Dân',
    description: 'Gạo Quê - Giá hợp lý, chất lượng ổn định cho bữa ăn hàng ngày.',
    longDescription:
      'Dòng gạo bình dân của Gạo Trần Huy mang hương vị quê nhà giản dị nhưng đầy ấm áp. Phù hợp cho gia đình, quán ăn, nhà hàng với giá thành hợp lý, chất lượng ổn định qua từng mùa thu hoạch.',
    image:
      'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Wheat',
    order: 1,
  },
  {
    slug: 'gao-dac-san',
    name: 'Gạo Đặc Sản',
    shortName: 'Đặc Sản',
    description: 'Dẻo thơm - Những giống lúa đặc sản vùng miền tuyển chọn.',
    longDescription:
      'Gạo đặc sản tuyển chọn từ những vùng đất trù phú nhất Việt Nam: ST25, Tám Xô Điện Biên, Nàng Hương, Nàng Thơm Chợ Đào... Hạt dẻo, thơm lừng, vị ngọt thanh.',
    image:
      'https://images.pexels.com/photos/7421205/pexels-photo-7421205.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Sparkles',
    order: 2,
  },
  {
    slug: 'gao-nep-gao-lut',
    name: 'Gạo Nếp - Gạo Lứt',
    shortName: 'Nếp & Lứt',
    description: 'Nếp thơm dẻo cho bánh chưng, gạo lứt tốt cho sức khỏe.',
    longDescription:
      'Gạo nếp dẻo thơm làm bánh chưng, bánh tét, xôi nếp. Gạo lứt giàu dinh dưỡng, tốt cho người ăn kiêng, người tiểu đường và những ai yêu thích lối sống lành mạnh.',
    image:
      'https://images.pexels.com/photos/7421205/pexels-photo-7421205.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Leaf',
    order: 3,
  },
  {
    slug: 'gao-pho-thong',
    name: 'Gạo Phổ Thông',
    shortName: 'Phổ Thông',
    description: 'Thơm dẻo vừa - Cân bằng giá và chất lượng cho mọi gia đình.',
    longDescription:
      'Dòng gạo phổ thông thơm dẻo vừa phải, phù hợp với khẩu vị đa số gia đình Việt. Cơm chín tơi xốp, hương thơm nhẹ, giá cả phải chăng.',
    image:
      'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Sprout',
    order: 4,
  },
  {
    slug: 'nuoc-mam-dau-lac',
    name: 'Nước Mắm & Dầu Lạc',
    shortName: 'Mắm & Dầu',
    description: 'Nước mắm nhĩ Nam Ô, dầu lạc nguyên chất đậm đà vị Việt.',
    longDescription:
      'Nước mắm nhĩ Nam Ô truyền thống ủ chượp tự nhiên, đạm cá cao, vị mặn hậu, hậu ngọt. Dầu lạc nguyên chất ép lạnh, thơm bùi, giàu dinh dưỡng cho bữa cơm gia đình.',
    image:
      'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'Droplet',
    order: 5,
  },
  {
    slug: 'san-pham-khac',
    name: 'Sản Phẩm Khác',
    shortName: 'Khác',
    description: 'Đậu, hạt, gia vị và các đặc sản nông sản vùng miền.',
    longDescription:
      'Các sản phẩm nông sản đặc sản khác: đậu xanh, đậu đen, mè, các loại hạt dinh dưỡng và gia vị truyền thống - tất cả được tuyển chọn kỹ lưỡng.',
    image:
      'https://images.pexels.com/photos/2286779/pexels-photo-2286779.jpeg?auto=compress&cs=tinysrgb&w=800',
    icon: 'ShoppingBasket',
    order: 6,
  },
];
